// RegisterPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../Hook/useAuth.js'
import useAxios from '../../Hook/useAxios.js';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const RegisterPage = () => {

  const { register, handleSubmit, watch, formState: { errors }, setValue, reset } = useForm();
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { createUser, updateUser, googleLogin } = useAuth();
  const createServerUser = useAxios('post', '/users');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const gUser = await googleLogin();
      if (!gUser) throw new Error('Google login failed');

      try {
        await createServerUser.mutateAsync({
          name: gUser.displayName || null,
          email: gUser.email,
          role: 'user',
          photoURL: gUser.photoURL || null,
        });
      } catch (err) {
        console.warn('Failed to persist Google user to server', err);
      }

      alert('Signed in with Google');
      navigate('/dashboard');
    } catch (err) {
      console.error('Google sign-in error', err);
      alert(err.message || 'Google sign-in failed');
    }
  };

  const avatarFile = watch('avatar') && watch('avatar')[0];

  useEffect(() => {
    if (!avatarFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(avatarFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

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

  const onSubmit = async (data) => {
    try {
      const avatar = data.avatar?.[0];
      console.log('Register submitted', { ...data, avatar });

      let avatarUrl = null;
      if (avatar) {
        avatarUrl = await uploadToImgbb(avatar);
        console.log('Uploaded avatar URL:', avatarUrl);
      }

      // create user with firebase auth
      const createdUser = await createUser(data.email, data.password);
      if (createdUser && updateUser) {
        await updateUser({ displayName: data.name, photoURL: avatarUrl });
      }

      // persist user on server
      try {
        await createServerUser.mutateAsync({ name: data.name, email: data.email, role: 'user', photoURL: avatarUrl });
      } catch (err) {
        console.warn('Failed to persist user to server via useAxios', err);
      }

      // reset form
      reset();
      if (fileInputRef.current) fileInputRef.current.value = null;
      setPreviewUrl(null);

      // redirect or show success message - keep simple for now
      alert('Registration successful');
    } catch (err) {
      console.error('Registration error', err);
      alert(err.message || 'Registration failed');
    }
  };

  const removeAvatar = () => {
    setValue('avatar', null);
    if (fileInputRef.current) fileInputRef.current.value = null;
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>

          <h2 className="text-3xl font-bold text-center text-primary mb-1">Create Your Account</h2>
          <p className="text-center text-sm text-base-content/70 mb-6">
            Start booking your dream decoration service today!
          </p>

          {/* Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              placeholder="Your Full Name"
              className="input input-bordered"
            />
            {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              placeholder="email@example.com"
              className="input input-bordered"
            />
            {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
              type="password"
              placeholder="password"
              className="input input-bordered"
            />
            {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
          </div>

          {/* Avatar / Image Upload */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Profile Image (optional)</span>
            </label>

            <input
              {...register('avatar')}
              ref={(e) => { register('avatar').ref(e); fileInputRef.current = e; }}
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
            />

            {previewUrl && (
              <div className="mt-3 flex items-center gap-4">
                <img src={previewUrl} alt="preview" className="w-24 h-24 object-cover rounded" />
                <div>
                  <p className="text-sm">Selected file: <strong>{avatarFile?.name}</strong></p>
                  <button type="button" className="btn btn-sm mt-2" onClick={removeAvatar}>Remove</button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button className="btn btn-secondary text-white">Register</button>
          </div>

          <div className="divider">OR</div>

          <div className=" form-control">
            <button type="button" onClick={handleGoogleSignIn} className="btn btn-outline btn-secondary flex items-center justify-center gap-2 w-full">
              <FaGoogle /> Continue with Google
            </button>
          </div>

          {/* Switch to Login */}
          <div className="text-center mt-4">
            <a
              href="/login" // Route to your login page
              className="link link-hover text-sm text-primary"
            >
              Already have an account? Login
            </a>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegisterPage;