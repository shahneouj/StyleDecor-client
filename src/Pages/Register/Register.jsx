// RegisterPage.jsx
import React from 'react';
import useAuth from '../../Hook/useAuth.js'
const RegisterPage = () => {
  const { createUser } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Your registration logic goes here
    // createUser()
    console.log("Register form submitted");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>

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
              type="text"
              placeholder="Your Full Name"
              className="input input-bordered"
              required
            />
          </div>

          {/* Email Field */}
          <div className="form-control">
            <label className="label">
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
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button className="btn btn-secondary text-white">Register</button>
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