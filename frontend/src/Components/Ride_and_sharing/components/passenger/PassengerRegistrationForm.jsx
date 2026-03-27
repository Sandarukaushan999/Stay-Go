import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CAMPUSES } from '../../utils/constants';
import { passengerRegistrationSchema } from '../../utils/validators';
import AppButton from '../common/AppButton';
import AppInput from '../common/AppInput';
import LocationPickerMap from '../maps/LocationPickerMap';

const PassengerRegistrationForm = ({ onSubmit, submitting = false }) => {
  const [pickupLocation, setPickupLocation] = useState({
    ...CAMPUSES[0].location,
    addressText: 'Selected on map',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passengerRegistrationSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      contactNumber: '',
      gender: '',
      address: '',
      campusId: CAMPUSES[0].id,
      studentId: '',
      pickupLocation,
      emergencyContactName: '',
      emergencyContactPhone: '',
    },
  });

  const submitHandler = (values) => {
    onSubmit?.({
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      contactNumber: values.contactNumber.trim(),
      gender: values.gender.trim(),
      address: values.address.trim(),
      campusId: values.campusId,
      studentId: values.studentId.trim(),
      emergencyContactName: values.emergencyContactName.trim(),
      emergencyContactPhone: values.emergencyContactPhone.trim(),
      pickupLocation: {
        ...pickupLocation,
        addressText: values.address.trim(),
      },
      emergencyContact: {
        name: values.emergencyContactName.trim(),
        phone: values.emergencyContactPhone.trim(),
      },
    });
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit(submitHandler)}>
      <AppInput label="Name" error={errors.name?.message} {...register('name')} />
      <AppInput label="Email" error={errors.email?.message} {...register('email')} />
      <AppInput
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      <AppInput label="Contact Number" error={errors.contactNumber?.message} {...register('contactNumber')} />
      <AppInput label="Gender" error={errors.gender?.message} {...register('gender')} />
      <AppInput label="Address" error={errors.address?.message} {...register('address')} />
      <label className="app-field">
        <span className="app-field-label">Campus</span>
        <select className="app-input" {...register('campusId')}>
          {CAMPUSES.map((campus) => (
            <option key={campus.id} value={campus.id}>
              {campus.name}
            </option>
          ))}
        </select>
      </label>
      <AppInput label="Student ID" error={errors.studentId?.message} {...register('studentId')} />
      <AppInput
        label="Emergency Contact Name"
        error={errors.emergencyContactName?.message}
        {...register('emergencyContactName')}
      />
      <AppInput
        label="Emergency Contact Phone"
        error={errors.emergencyContactPhone?.message}
        {...register('emergencyContactPhone')}
      />

      <div className="map-field">
        <h4>Select Pickup Location</h4>
        <LocationPickerMap
          center={[pickupLocation.lat, pickupLocation.lng]}
          onSelect={(coords) => setPickupLocation({ ...coords, addressText: 'Selected on map' })}
        />
      </div>

      <AppButton type="submit" disabled={submitting}>
        {submitting ? 'Registering...' : 'Register Passenger'}
      </AppButton>
    </form>
  );
};

export default PassengerRegistrationForm;
