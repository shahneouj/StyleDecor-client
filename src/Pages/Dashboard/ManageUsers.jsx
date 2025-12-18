import React, { useEffect, useState } from 'react';
import useAuth from '../../Hook/useAuth.js';
import useAxios from '../../Hook/useAxios.js';
import { useQueryClient } from '@tanstack/react-query';

const ManageUsers = () => {
  const { user } = useAuth();
  // useAxios GET to fetch users (protected by token automatically)
  const { data: usersResp, isLoading, error, refetch } = useAxios('get', '/users', {}, { enabled: !!user });
  const users = usersResp?.data || [];
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (error) {
      console.error('Could not fetch users via useAxios:', error);
      alert(error.message || 'Error fetching users');
    }
    // eslint-disable-next-line
  }, [error]);

  const queryClient = useQueryClient();

  const changeRole = async (email, role) => {
    if (!confirm(`Change role for ${email} to ${role}?`)) return;
    try {
      setUpdating(true);
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL || ''}/users/${encodeURIComponent(email)}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role }),
      });
      const json = await res.json();
      if (json.success) {
        alert('Role updated');
        // invalidate cache for users list and the specific user so NavBar updates
        queryClient.invalidateQueries({ predicate: (q) => {
          const key = q.queryKey && q.queryKey[0];
          return key === '/users' || key === `/users/${email}`;
        }});
        refetch();
      } else {
        throw new Error(json.message || 'Update failed');
      }
    } catch (err) {
      console.error('Role update error:', err);
      alert(err.message || 'Could not update role');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Manage Users</h3>
      {isLoading ? (
        <div className="mockup-window border bg-base-200 p-4">Loading…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>{u.name || '-'}</td>
                  <td>{u.role}</td>
                  <td>
                    <div className="btn-group">
                      <button disabled={updating} className="btn btn-xs" onClick={() => changeRole(u.email, 'user')}>User</button>
                      <button disabled={updating} className="btn btn-xs" onClick={() => changeRole(u.email, 'decorator')}>Decorator</button>
                      <button disabled={updating} className="btn btn-xs btn-primary" onClick={() => changeRole(u.email, 'admin')}>Make Admin</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
