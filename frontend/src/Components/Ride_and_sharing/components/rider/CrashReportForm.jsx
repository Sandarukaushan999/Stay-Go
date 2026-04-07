import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { incidentSchema } from '../../utils/validators';
import AppButton from '../common/AppButton';
import AppInput from '../common/AppInput';

const CrashReportForm = ({ tripId, defaultLocation, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      tripId,
      type: 'crash',
      message: '',
      severity: 'medium',
      imageUrl: '',
      location: defaultLocation || { lat: 0, lng: 0, addressText: '' },
    },
  });

  return (
    <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
      <h3>Crash / Incident Report</h3>
      <AppInput label="Message" as="textarea" error={errors.message?.message} {...register('message')} />
      <label className="app-field">
        <span className="app-field-label">Severity</span>
        <select className="app-input" {...register('severity')}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </label>
      <AppInput label="Image URL (optional)" {...register('imageUrl')} />
      <AppButton type="submit">Submit Incident</AppButton>
    </form>
  );
};

export default CrashReportForm;
