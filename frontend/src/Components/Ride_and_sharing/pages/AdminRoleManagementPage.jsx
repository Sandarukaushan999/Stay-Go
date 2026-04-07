import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  deleteAdminUser,
  getAdminPassengers,
  getAdminRiders,
  updateAdminUser,
} from '../api/adminApi';
import AdminUserManagementTable from '../components/admin/AdminUserManagementTable';
import AppButton from '../components/common/AppButton';
import AppInput from '../components/common/AppInput';
import AppModal from '../components/common/AppModal';
import { CAMPUSES } from '../utils/constants';

const DEFAULT_FORM_VALUES = {
  name: '',
  email: '',
  contactNumber: '',
  gender: '',
  address: '',
  campusId: '',
  studentId: '',
  isVerified: false,
  isBlocked: false,
  vehicleNumber: '',
  vehicleType: '',
  seatCount: '0',
  availability: 'offline',
  isOnline: false,
  emergencyContactName: '',
  emergencyContactPhone: '',
};

const buildFormValues = (user = {}) => ({
  name: user.name || '',
  email: user.email || '',
  contactNumber: user.contactNumber || '',
  gender: user.gender || '',
  address: user.address || '',
  campusId: user.campusId || '',
  studentId: user.studentId || '',
  isVerified: Boolean(user.isVerified),
  isBlocked: Boolean(user.isBlocked),
  vehicleNumber: user.vehicleNumber || '',
  vehicleType: user.vehicleType || '',
  seatCount: String(user.seatCount ?? 0),
  availability: user.availability || 'offline',
  isOnline: Boolean(user.isOnline),
  emergencyContactName: user.emergencyContact?.name || '',
  emergencyContactPhone: user.emergencyContact?.phone || '',
});

function getUserId(user) {
  return user?._id || user?.id || '';
}

const AdminRoleManagementPage = ({ role = 'rider' }) => {
  const isRider = role === 'rider';
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      if (isRider) {
        const data = await getAdminRiders();
        setUsers(data.riders || []);
      } else {
        const data = await getAdminPassengers();
        setUsers(data.passengers || []);
      }
    } catch (requestError) {
      setError(requestError.message || `Failed to load ${isRider ? 'riders' : 'passengers'}.`);
    } finally {
      setIsLoading(false);
    }
  }, [isRider]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const pageTitle = useMemo(() => (isRider ? 'Rider Management' : 'Passenger Management'), [isRider]);

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormValues(buildFormValues(user));
    setModalError('');
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setFormValues(DEFAULT_FORM_VALUES);
    setModalError('');
    setIsSubmitting(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormValues((previous) => {
      if (name === 'isVerified' || name === 'isBlocked' || name === 'isOnline') {
        return { ...previous, [name]: value === 'true' };
      }

      return { ...previous, [name]: value };
    });
  };

  const handleDeleteUser = async (user) => {
    const userId = getUserId(user);

    if (!userId) {
      setError('Unable to identify the selected user.');
      return;
    }

    const confirmed = window.confirm(
      `Delete ${isRider ? 'rider' : 'passenger'} "${user.name || user.email || userId}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminUser(userId);
      await loadUsers();

      if (getUserId(editingUser) === userId) {
        closeEditModal();
      }
    } catch (requestError) {
      setError(requestError.message || 'Failed to delete user.');
    }
  };

  const handleSubmitUpdate = async (event) => {
    event.preventDefault();

    const userId = getUserId(editingUser);

    if (!userId) {
      setModalError('Unable to identify the selected user.');
      return;
    }

    const seatCount = Number(formValues.seatCount);

    const payload = {
      name: formValues.name.trim(),
      email: formValues.email.trim().toLowerCase(),
      contactNumber: formValues.contactNumber.trim(),
      gender: formValues.gender.trim(),
      address: formValues.address.trim(),
      campusId: formValues.campusId.trim(),
      studentId: formValues.studentId.trim(),
      isVerified: Boolean(formValues.isVerified),
      isBlocked: Boolean(formValues.isBlocked),
    };

    if (isRider) {
      payload.vehicleNumber = formValues.vehicleNumber.trim();
      payload.vehicleType = formValues.vehicleType.trim();
      payload.seatCount = Number.isFinite(seatCount) && seatCount >= 0 ? seatCount : 0;
      payload.availability = (formValues.availability || 'offline').trim().toLowerCase();
      payload.isOnline = Boolean(formValues.isOnline);
    } else {
      payload.emergencyContact = {
        name: formValues.emergencyContactName.trim(),
        phone: formValues.emergencyContactPhone.trim(),
      };
    }

    setIsSubmitting(true);
    setModalError('');

    try {
      await updateAdminUser(userId, payload);
      await loadUsers();
      closeEditModal();
    } catch (requestError) {
      setModalError(requestError.message || 'Failed to update user.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="panel page-header">
        <h1>{pageTitle}</h1>
        <div className="button-row">
          <Link to="/admin/dashboard">Back to Dashboard</Link>
          <Link to="/admin/users">All Users</Link>
        </div>
      </section>

      <section className="panel">
        <div className="admin-management-summary">
          <p className="admin-section-note">
            Showing all registered {isRider ? 'riders' : 'passengers'} with admin edit and delete controls.
          </p>
          <strong className="admin-total-count">
            Total registered {isRider ? 'riders' : 'passengers'}: {users.length}
          </strong>
        </div>

        {error ? <p className="app-error">{error}</p> : null}
        {isLoading ? (
          <p className="app-info">Loading {isRider ? 'riders' : 'passengers'}...</p>
        ) : (
          <AdminUserManagementTable users={users} role={role} onEdit={openEditModal} onDelete={handleDeleteUser} />
        )}
      </section>

      <AppModal open={Boolean(editingUser)} title={`Edit ${isRider ? 'Rider' : 'Passenger'}`} onClose={closeEditModal}>
        <form className="form-grid two-col admin-modal-form" onSubmit={handleSubmitUpdate}>
          <AppInput label="Name" name="name" value={formValues.name} onChange={handleFormChange} required />
          <AppInput label="Email" name="email" value={formValues.email} onChange={handleFormChange} required />
          <AppInput
            label="Contact Number"
            name="contactNumber"
            value={formValues.contactNumber}
            onChange={handleFormChange}
          />
          <AppInput label="Gender" name="gender" value={formValues.gender} onChange={handleFormChange} />
          <AppInput label="Address" name="address" value={formValues.address} onChange={handleFormChange} />
          <AppInput label="Student ID" name="studentId" value={formValues.studentId} onChange={handleFormChange} />

          <label className="app-field">
            <span className="app-field-label">Campus</span>
            <select className="app-input" name="campusId" value={formValues.campusId} onChange={handleFormChange}>
              <option value="">Select campus</option>
              {CAMPUSES.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
          </label>

          <label className="app-field">
            <span className="app-field-label">Verified</span>
            <select className="app-input" name="isVerified" value={String(formValues.isVerified)} onChange={handleFormChange}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>

          <label className="app-field">
            <span className="app-field-label">Blocked</span>
            <select className="app-input" name="isBlocked" value={String(formValues.isBlocked)} onChange={handleFormChange}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </label>

          {isRider ? (
            <>
              <AppInput
                label="Vehicle Number"
                name="vehicleNumber"
                value={formValues.vehicleNumber}
                onChange={handleFormChange}
              />
              <AppInput
                label="Vehicle Type"
                name="vehicleType"
                value={formValues.vehicleType}
                onChange={handleFormChange}
              />
              <AppInput
                label="Seat Count"
                name="seatCount"
                type="number"
                min="0"
                value={formValues.seatCount}
                onChange={handleFormChange}
              />

              <label className="app-field">
                <span className="app-field-label">Availability</span>
                <select
                  className="app-input"
                  name="availability"
                  value={formValues.availability}
                  onChange={handleFormChange}
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </label>

              <label className="app-field">
                <span className="app-field-label">Currently Online</span>
                <select className="app-input" name="isOnline" value={String(formValues.isOnline)} onChange={handleFormChange}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            </>
          ) : (
            <>
              <AppInput
                label="Emergency Contact Name"
                name="emergencyContactName"
                value={formValues.emergencyContactName}
                onChange={handleFormChange}
              />
              <AppInput
                label="Emergency Contact Phone"
                name="emergencyContactPhone"
                value={formValues.emergencyContactPhone}
                onChange={handleFormChange}
              />
            </>
          )}

          {modalError ? <p className="app-error admin-modal-error">{modalError}</p> : null}

          <div className="admin-modal-actions">
            <AppButton type="button" variant="ghost" onClick={closeEditModal}>
              Cancel
            </AppButton>
            <AppButton type="submit" variant="success" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update User'}
            </AppButton>
          </div>
        </form>
      </AppModal>
    </main>
  );
};

export default AdminRoleManagementPage;
