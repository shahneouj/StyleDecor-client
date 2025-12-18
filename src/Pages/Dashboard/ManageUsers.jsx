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

  // Per-user role action buttons which use the useAxios hook for PUT /users/:email/role
  const RoleButtons = ({ email }) => {
    const [localLoading, setLocalLoading] = useState(false);
    const updateRole =  useAxios('patch', `/users/${encodeURIComponent(email)}/role`);
  

    const doChangeRole = async (role) => {
        console.log("fatch");
    //   if (!confirm(`Change role for ${email} to ${role}?`)) return;
      try {
        setLocalLoading(true);
        console.log(`Attempting role change for ${email} -> ${role}`);
        const json = await updateRole.mutateAsync({ role });
        console.log('Role update response:', json);
        if (json && json.success) {
          alert('Role updated');
          // invalidate cache for users list and the specific user so NavBar updates
          queryClient.invalidateQueries({ predicate: (q) => {
            const key = q.queryKey && q.queryKey[0];
            return key === '/users' || key === `/users/${email}`;
          }});
          refetch();
        } else {
          const serverMsg = (json && json.message) || (json && json.error) || 'Update failed';
          console.error('Server returned error for role update:', serverMsg, json);
          alert(serverMsg);
        }
      } catch (err) {
        // Axios or other network error
        console.error('Role update error (exception):', err);
        const serverBody = err?.response?.data;
        if (serverBody && serverBody.message) {
          alert(serverBody.message);
        } else if (err.message) {
          alert(err.message);
        } else {
          alert('Could not update role');
        }
      } finally {
        setLocalLoading(false);
      }
    };

    return (
      <div className="btn-group">
        <button disabled={localLoading} className="btn btn-xs" onClick={() => doChangeRole('user')}>User</button>
        <button disabled={localLoading} className="btn btn-xs" onClick={() => doChangeRole('decorator')}>Decorator</button>
        <button disabled={localLoading} className="btn btn-xs btn-primary" onClick={() => doChangeRole('admin')}>Make Admin</button>
      </div>
    );
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
                    <RoleButtons email={u.email} />
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
