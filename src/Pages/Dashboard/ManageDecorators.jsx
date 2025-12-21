import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../Hook/useAuth.js';
import useAxios from '../../Hook/useAxios.js';
import { useQueryClient } from '@tanstack/react-query';
const emptyForm = {
  name: '',
  email: '',
  phone: '',
  specialties: '',
  bio: '',
  profileImage: '',
  rating: 0,
  active: true,
};

const ManageDecorators = () => {
  const { user } = useAuth();
  const { data: resp, isLoading, error, refetch } = useAxios('get', '/decorators', {}, { enabled: !!user });
  const decorators = resp?.data || [];

  const createDecorator = useAxios('post', '/decorators');
  const { register, handleSubmit, reset, setValue, watch } = useForm({ defaultValues: emptyForm });
  const [editingId, setEditingId] = useState(null);
  const updateDecorator = useAxios('patch', `/decorators/${editingId || ''}`);
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  // image preview state for uploaded file or existing URL
  const [previewUrl, setPreviewUrl] = useState(null);
  const profileFile = watch('profileImageFile');

  useEffect(() => {
    if (!profileFile || profileFile.length === 0) {
      return setPreviewUrl((prev) => prev && prev.startsWith('blob:') ? null : prev);
    }
    const file = profileFile[0];
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profileFile]);

  const uploadToImgbb = async (file) => {
    if (!file) return null;
    const key = import.meta.env.VITE_IMGBB_KEY;
    if (!key) throw new Error('VITE_IMGBB_KEY is not set in environment');

    const fd = new FormData();
    fd.append('image', file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: 'POST',
      body: fd,
    });

    const json = await res.json();
    if (!json.success) throw new Error('Image upload failed');
    return json.data.display_url || json.data.url;
  };

  useEffect(() => {
    if (error) {
      console.error('Error loading decorators:', error);
      alert(error.message || 'Could not load decorators');
    }
  }, [error]);

  const onSubmit = async (formValues) => {
    try {
      setSaving(true);
      // handle profile image: file upload has priority, otherwise optional URL
      let profileImageUrl = null;
      const file = formValues.profileImageFile && formValues.profileImageFile.length ? formValues.profileImageFile[0] : null;
      if (file) {
        profileImageUrl = await uploadToImgbb(file);
      } else if (formValues.profileImage) {
        profileImageUrl = formValues.profileImage;
      } else if (previewUrl && previewUrl.startsWith('blob:')) {
        // if preview came from earlier file but not in formValues, ignore
        profileImageUrl = null;
      }

      const payload = {
        name: formValues.name,
        email: formValues.email,
        phone: formValues.phone || null,
        specialties: formValues.specialties ? formValues.specialties.split(',').map(s => s.trim()).filter(Boolean) : [],
        bio: formValues.bio || '',
        profileImage: profileImageUrl || null,
        rating: Number(formValues.rating) || 0,
        active: !!formValues.active,
      };

      if (editingId) {
        // update via useAxios patch mutation (attaches auth token)
        const json = await updateDecorator.mutateAsync(payload);
        if (!json || !json.success) throw new Error((json && json.message) || 'Update failed');
        alert('Decorator updated');
        queryClient.invalidateQueries({ queryKey: ['/decorators'] });
      } else {
        await createDecorator.mutateAsync(payload);
        alert('Decorator created');
        queryClient.invalidateQueries({ queryKey: ['/decorators'] });
      }

      reset(emptyForm);
      setEditingId(null);
      refetch();
    } catch (err) {
      console.error('Save error:', err);
      const body = err?.response?.data || err;
      if (body && body.message) alert(body.message);
      else alert(err.message || 'Could not save decorator');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (d) => {
    setEditingId(d._id);
    reset({
      name: d.name || '',
      email: d.email || '',
      phone: d.phone || '',
      specialties: (d.specialties || []).join(', '),
      bio: d.bio || '',
      profileImage: d.profileImage || '',
      rating: d.rating || 0,
      active: !!d.active,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset(emptyForm);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="card p-6 bg-base-100 shadow">
        <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Decorator' : 'Create Decorator'}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 shadow-lg p-6 max-w-3xl">
  <h2 className="text-xl font-semibold mb-6">
    {editingId ? "Update Decorator" : "Create Decorator"}
  </h2>

  {/* Basic Info */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="form-control">
      <label className="label font-medium">Name</label>
      <input {...register("name")} className="input input-bordered" />
    </div>

    <div className="form-control">
      <label className="label font-medium">Email</label>
      <input {...register("email")} className="input input-bordered" />
    </div>

    <div className="form-control">
      <label className="label font-medium">Phone</label>
      <input {...register("phone")} className="input input-bordered" />
    </div>

    <div className="form-control">
      <label className="label font-medium">Rating</label>
      <input
        {...register("rating")}
        type="number"
        step="0.1"
        className="input input-bordered"
      />
    </div>
  </div>

  {/* Specialties */}
  <div className="form-control mt-4">
    <label className="label font-medium">
      Specialties
      <span className="label-text-alt text-gray-400">
        comma separated
      </span>
    </label>
    <input {...register("specialties")} className="input input-bordered" />
  </div>

  {/* Bio */}
  <div className="form-control mt-4">
    <label className="label font-medium">Bio</label>
    <textarea
      {...register("bio")}
      className="textarea textarea-bordered"
      rows={3}
    />
  </div>

  {/* Profile Image */}
  <div className="form-control mt-6">
    <label className="label font-medium">Profile Image</label>

    <div className="flex flex-col md:flex-row gap-4">
      <input
        type="file"
        accept="image/*"
        {...register("profileImageFile")}
        className="file-input file-input-bordered w-full"
      />

      <input
        {...register("profileImage")}
        placeholder="Paste image URL (optional)"
        className="input input-bordered w-full"
      />
    </div>

    {previewUrl && (
      <div className="mt-4 flex items-center gap-4 bg-base-200 p-4 rounded-lg">
        <img
          src={previewUrl}
          alt="preview"
          className="w-24 h-24 object-cover rounded-lg ring ring-primary"
        />
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => {
            setValue("profileImageFile", null);
            setValue("profileImage", "");
            setPreviewUrl(null);
          }}
        >
          Remove Image
        </button>
      </div>
    )}
  </div>

  {/* Active Toggle */}
  <div className="form-control mt-6">
    <label className="label cursor-pointer justify-start gap-4">
      <span className="label-text font-medium">Active</span>
      <input {...register("active")} type="checkbox" className="toggle toggle-primary" />
    </label>
  </div>

  {/* Actions */}
  <div className="flex justify-end gap-3 mt-8">
    {editingId && (
      <button type="button" onClick={cancelEdit} className="btn btn-ghost">
        Cancel
      </button>
    )}
    <button className="btn btn-primary" disabled={saving}>
      {editingId ? "Update" : "Create"}
    </button>
  </div>
</form>
      </div>

      <div className="lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Decorators</h3>
        {isLoading ? (
          <div className="mockup-window border bg-base-200 p-4">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {decorators.map((d) => (
                  <tr key={d._id}>
                    <td>{d.name}</td>
                    <td>{d.email}</td>
                    <td>{(d.rating || 0).toFixed(1)}</td>
                    <td>{d.active ? 'Yes' : 'No'}</td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-xs" onClick={() => startEdit(d)}>Edit</button>
                        <DecoratorActions decorator={d} onDone={() => refetch()} />
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

// Per-row actions (delete / toggle active / quick update)
const Deletor = ({ id, onDone }) => {
  const del = useAxios('delete', `/decorators/${id}`);
  const queryClient = useQueryClient();
  const handle = async () => {
    if (!confirm('Delete this decorator?')) return;
    try {
      await del.mutateAsync();
      alert('Deleted');
      queryClient.invalidateQueries({ queryKey: ['/decorators'] });
      onDone();
    } catch (err) {
      console.error('Delete error:', err);
      alert(err?.response?.data?.message || err.message || 'Delete failed');
    }
  };
  return <button className="btn btn-xs btn-error" onClick={handle}>Delete</button>;
};

const ToggleActive = ({ decorator, onDone }) => {
  const update = useAxios('patch', `/decorators/${decorator._id}`);
  const queryClient = useQueryClient();
  const handle = async () => {
    try {
      await update.mutateAsync({ active: !decorator.active });
      alert('Updated');
      queryClient.invalidateQueries({ queryKey: ['/decorators'] });
      onDone();
    } catch (err) {
      console.error('Toggle error:', err);
      alert(err?.response?.data?.message || err.message || 'Update failed');
    }
  };
  return <button className="btn btn-xs" onClick={handle}>{decorator.active ? 'Disable' : 'Enable'}</button>;
};

const DecoratorActions = ({ decorator, onDone }) => {
  return (
    <>
      <ToggleActive decorator={decorator} onDone={onDone} />
      <Deletor id={decorator._id} onDone={onDone} />
    </>
  );
};

export default ManageDecorators;
