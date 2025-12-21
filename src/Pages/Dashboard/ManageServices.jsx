import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../Hook/useAuth.js';
import useAxios from '../../Hook/useAxios.js';
import { useQueryClient } from '@tanstack/react-query';

const emptyForm = {
  service_name: '',
  cost: '',
  unit: '',
  category: '',
  description: '',
};
const ManageServices = () => {
  const { user } = useAuth();
  const { data: resp, isLoading, error, refetch } = useAxios('get', '/services', {}, { enabled: !!user });
  const services = resp?.data || [];

  const createService = useAxios('post', '/services');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({ defaultValues: emptyForm });
  const [editingId, setEditingId] = useState(null);
  const updateService = useAxios('patch', `/services/${editingId || ''}`);
  const deleteService = useAxios('delete', `/services/${editingId || ''}`);
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (error) {
      console.error('Error loading services:', error);
      alert(error.message || 'Could not load services');
    }
  }, [error]);

  const onSubmit = async (formValues) => {
    try {
      setSaving(true);
      const payload = {
        service_name: formValues.service_name,
        cost: Number(formValues.cost) || 0,
        unit: formValues.unit,
        category: formValues.category,
        description: formValues.description || '',
      };

      if (editingId) {
        const json = await updateService.mutateAsync(payload);
        if (!json || !json.success) throw new Error((json && json.message) || 'Update failed');
        alert('Service updated');
        queryClient.invalidateQueries({ queryKey: ['/services'] });
      } else {
        await createService.mutateAsync(payload);
        alert('Service created');
        queryClient.invalidateQueries({ queryKey: ['/services'] });
      }

      reset(emptyForm);
      setEditingId(null);
      refetch();
    } catch (err) {
      console.error('Save error:', err);
      const body = err?.response?.data || err;
      if (body && body.message) alert(body.message);
      else alert(err.message || 'Could not save service');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    reset({
      service_name: s.service_name || '',
      cost: s.cost || '',
      unit: s.unit || '',
      category: s.category || '',
      description: s.description || '',
    });
  }; 

  const cancelEdit = () => {
    setEditingId(null);
    reset(emptyForm);
  };

  const Deletor = ({ id, onDone }) => {
    const del = useAxios('delete', `/services/${id}`);
    const handle = async () => {
      if (!confirm('Delete this service?')) return;
      try {
        await del.mutateAsync();
        alert('Deleted');
        queryClient.invalidateQueries({ queryKey: ['/services'] });
        onDone();
      } catch (err) {
        console.error('Delete error:', err);
        alert(err?.response?.data?.message || err.message || 'Delete failed');
      }
    };
    return <button className="btn btn-xs btn-error" onClick={handle}>Delete</button>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="card p-6 bg-base-100 shadow">
        <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Service/Package' : 'Create Service/Package'}</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control mb-2">
            <label className="label"><span className="label-text">Service Name</span></label>
            <input {...register('service_name', { required: 'Service name is required' })} className="input input-bordered" />
            {errors.service_name && <p className="text-xs text-error mt-1">{errors.service_name.message}</p>}
          </div>

          <div className="form-control mb-2">
            <label className="label"><span className="label-text">Cost (BDT)</span></label>
            <input {...register('cost', { required: 'Cost is required', pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: 'Must be a number' } })} className="input input-bordered" />
            {errors.cost && <p className="text-xs text-error mt-1">{errors.cost.message}</p>}
          </div>

          <div className="form-control mb-2">
            <label className="label"><span className="label-text">Unit</span></label>
            <input {...register('unit', { required: 'Unit is required' })} className="input input-bordered" />
            {errors.unit && <p className="text-xs text-error mt-1">{errors.unit.message}</p>}
          </div>

          <div className="form-control mb-2">
            <label className="label"><span className="label-text">Category</span></label>
            <input {...register('category', { required: 'Category is required' })} className="input input-bordered" />
            {errors.category && <p className="text-xs text-error mt-1">{errors.category.message}</p>}
          </div>

          <div className="form-control mb-4">
            <label className="label"><span className="label-text">Description</span></label>
            <textarea {...register('description')} className="textarea textarea-bordered" rows={4}></textarea>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-primary" disabled={saving}>{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={cancelEdit} className="btn btn-ghost">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Services & Packages</h3>
        {isLoading ? (
          <div className="mockup-window border bg-base-200 p-4">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Cost</th>
                  <th>Unit</th>
                  <th>Category</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id}>
                    <td>{s.service_name || s.name}</td>
                    <td>{s.cost || s.price}</td>
                    <td>{s.unit || s.short}</td>
                    <td>{s.category}</td>
                    <td>{s.createdByEmail || '-'}</td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-xs" onClick={() => startEdit(s)}>Edit</button>
                        <Deletor id={s._id} onDone={() => refetch()} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageServices;
