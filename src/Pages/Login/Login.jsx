// LoginPage.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../Hook/useAuth.js';
import { useNavigate } from 'react-router';
import { FaGoogle } from 'react-icons/fa';
import useAxios from '../../Hook/useAxios.js';

const LoginPage = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const createServerUser = useAxios('post', '/users');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleGoogleSignIn = async () => {
    try {
      const gUser = await googleLogin();
      if (!gUser) throw new Error('Google login failed');

      try {
        // Do not override an existing role when persisting Google sign-in.
        await createServerUser.mutateAsync({
          name: gUser.displayName || null,
          email: gUser.email,
          photoURL: gUser.photoURL || null,
        });
      } catch (err) {
        console.warn('Failed to persist Google user to server', err);
      }

      navigate('/');
    } catch (err) {
      console.error('Google sign-in error', err);
      alert(err.message || 'Google sign-in failed');
    }
  };

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      // successful login
      navigate('/');
    } catch (err) {
      console.error('Login failed', err);
      alert(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>

          <h2 className="text-3xl font-bold text-center text-primary mb-1">Welcome Back!</h2>
          <p className="text-center text-sm text-base-content/70 mb-6">
            Sign in to manage your StyleDecor appointments.
          </p>

          <div className="form-control">
            <label className="label flex justify-between items-center">
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
            <label className="label flex justify-between items-center">
              <span className="label-text">Password</span>
            </label>
            <input
              {...register('password', { required: 'Password is required' })}
              type="password"
              placeholder="password"
              className="input input-bordered"
            />
            {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
            <label className="label">
              <a href="#" className="label-text-alt link link-hover text-sm">Forgot password?</a>
            </label>
          </div>

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button className="btn btn-primary text-white">Sign In</button>
          </div>

          <div className="divider">OR</div>

          <div className="form-control">
            <button type="button" onClick={handleGoogleSignIn} className="btn btn-outline btn-secondary flex items-center justify-center gap-2 w-full">
              <FaGoogle /> Continue with Google
            </button>
          </div>

          {/* Switch to Register */}
          <div className="text-center mt-4">
            <a
              href="/register" // Route to your registration page
              className="link link-hover text-sm text-secondary"
            >
              Don't have an account? Register
            </a>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;