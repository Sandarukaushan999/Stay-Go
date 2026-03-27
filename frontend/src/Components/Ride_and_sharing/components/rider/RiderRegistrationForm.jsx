import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CAMPUSES } from '../../utils/constants';
import { riderRegistrationSchema } from '../../utils/validators';
import AppButton from '../common/AppButton';
import AppInput from '../common/AppInput';
import LocationPickerMap from '../maps/LocationPickerMap';

const RiderRegistrationForm = ({ onSubmit, submitting = false }) => {
  const [hostelLocation, setHostelLocation] = useState({
    ...CAMPUSES[0].location,
    addressText: 'Selected on map',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(riderRegistrationSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      contactNumber: '',
      gender: '',
      address: '',
      campusId: CAMPUSES[0].id,
      vehicleNumber: '',
      vehicleType: '',
      seatCount: 3,
      studentId: '',
      hostelLocation,
    },
  });

  const submitHandler = (values) => {
    onSubmit?.({
      ...values,
      hostelLocation: {
        ...hostelLocation,
        addressText: values.address,
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
      <AppInput label="Vehicle Number" error={errors.vehicleNumber?.message} {...register('vehicleNumber')} />
      <AppInput label="Vehicle Type" error={errors.vehicleType?.message} {...register('vehicleType')} />
      <AppInput label="Seat Count" type="number" error={errors.seatCount?.message} {...register('seatCount')} />
      <AppInput label="Student ID" error={errors.studentId?.message} {...register('studentId')} />

      <div className="map-field">
        <h4>Select Hostel / Home Location</h4>
        <LocationPickerMap
          center={[hostelLocation.lat, hostelLocation.lng]}
          onSelect={(coords) => setHostelLocation({ ...coords, addressText: 'Selected on map' })}
        />
      </div>

      <AppButton type="submit" disabled={submitting}>
        {submitting ? 'Registering...' : 'Register Rider'}
      </AppButton>
    </form>
  );
};

export default RiderRegistrationForm;
