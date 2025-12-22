import React, { useState } from 'react';
import useAuth from '../../Hook/useAuth.js';
import useAxios from '../../Hook/useAxios.js';
import { useQueryClient } from '@tanstack/react-query';

const statuses = ['assigned', 'in_progress', 'completed', 'cancelled'];

export default function UpdateProjectStatus() {
  const { user } = useAuth();
  const { data: resp, isLoading, error } = useAxios('get', '/bookings/assigned', {}, { enabled: !!user });
  const bookings = resp?.data || [];
  const queryClient = useQueryClient();

  const UpdateStatus = ({ booking }) => {
    // Note: use booking.progress_status to match your backend field
    const [status, setStatus] = useState(booking.progress_status || 'assigned');
    const [progress, setProgress] = useState(booking.progress ?? 0);
    const [loading, setLoading] = useState(false);
    const patch = useAxios('patch', `/bookings/${booking._id}/status`);

    const save = async (targetStatus, targetProgress) => {
      const finalStatus = targetStatus || status;
      const finalProgress = targetProgress !== undefined ? targetProgress : progress;

      if (!confirm(`Change to ${finalStatus.replace('_', ' ')}?`)) return;

      try {
        setLoading(true);
        // MATCHING BACKEND: key must be 'progress_status'
        const response = await patch.mutateAsync({
          progress_status: finalStatus,
          progress: finalProgress
        });

        if (response?.success) {
          alert('Status updated!');
          queryClient.invalidateQueries({ queryKey: ['/bookings/assigned'] });
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Update failed');
      } finally {
        setLoading(false);
      }
    };

    const advance = () => {
      const currentIndex = statuses.indexOf(status);
      // If currently in_progress (index 1), next is completed (index 2)
      if (currentIndex >= 0 && currentIndex < 2) {
        const nextStatus = statuses[currentIndex + 1];

        // Match progress to backend logic
        let nextProg = 50;
        if (nextStatus === 'completed') nextProg = 100;
        if (nextStatus === 'assigned') nextProg = 0;

        setStatus(nextStatus);
        setProgress(nextProg);

        // Execute save immediately with new values
        save(nextStatus, nextProg);
      }
    };

    return (
      <div className="flex items-center gap-2">
        <select
          className="select select-bordered select-sm capitalize"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>

        <div className="text-xs font-bold w-10">{progress}%</div>

        <button
          className="btn btn-sm btn-primary"
          onClick={() => save()}
          disabled={loading}
        >
          Save
        </button>

        <button
          className="btn btn-sm btn-secondary"
          onClick={advance}
          disabled={loading || status === 'completed'}
        >
          {status === 'in_progress' ? 'Complete' : 'Next'}
        </button>
      </div>
    );
  };

  if (isLoading) return <div>Loading assigned projects...</div>;
  if (error) return <div className="alert alert-error">Error loading data</div>;

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Assigned Projects</h3>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Service</th>
            <th>Status Control</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td>{b.serviceName}</td>
              <td><UpdateStatus booking={b} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}