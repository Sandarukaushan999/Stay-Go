import React from 'react';
import { CAMPUSES } from '../../utils/constants';
import AppButton from '../common/AppButton';

const RideSearchPanel = ({ form, onChange, onSearch, loading }) => {
  return (
    <section className="panel">
      <h3>Find Nearby Riders</h3>
      <div className="form-grid two-col">
        <label className="app-field">
          <span className="app-field-label">Campus</span>
          <select
            className="app-input"
            value={form.campusId}
            onChange={(event) => onChange({ ...form, campusId: event.target.value })}
          >
            {CAMPUSES.map((campus) => (
              <option key={campus.id} value={campus.id}>
                {campus.name}
              </option>
            ))}
          </select>
        </label>

        <label className="app-field checkbox-field">
          <input
            type="checkbox"
            checked={form.femaleOnly}
            onChange={(event) => onChange({ ...form, femaleOnly: event.target.checked })}
          />
          <span>Female-only preference</span>
        </label>
      </div>

      <AppButton onClick={onSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search Riders'}
      </AppButton>
    </section>
  );
};

export default RideSearchPanel;
