// LoginPage.jsx
import React from 'react';

const LoginPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Your login logic goes here
    console.log("Login form submitted");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>

          <h2 className="text-3xl font-bold text-center text-primary mb-1">Welcome Back!</h2>
          <p className="text-center text-sm text-base-content/70 mb-6">
            Sign in to manage your StyleDecor appointments.
          </p>

          <div className="form-control">
            <label className="label flex justify-between items-center">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="input input-bordered"
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label flex justify-between items-center">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered"
              required
            />
            <label className="label">
              <a href="#" className="label-text-alt link link-hover text-sm">Forgot password?</a>
            </label>
          </div>

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button className="btn btn-primary text-white">Sign In</button>
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