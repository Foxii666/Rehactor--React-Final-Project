import React, { useState } from 'react';
import supabase from '../supabase/supabase-client';
import { Link } from 'react-router';

// A simple placeholder validation schema for the registration form.
// In a real application, these parts are managed with a validation library.
const ConfirmSchema = {
  safeParse: (data) => {
    const errors = {};
    if (!data.email) errors.email = 'Email is required.';
    if (!data.firstName) errors.firstName = 'First Name is required.';
    if (!data.lastName) errors.lastName = 'Last Name is required.';
    if (!data.username) errors.username = 'Username is required.';
    if (!data.password) errors.password = 'Password is required.';

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        error: {
          issues: Object.keys(errors).map((key) => ({
            path: [key],
            message: errors[key],
          })),
        },
      };
    }
    return { success: true, data };
  },
};

const getErrors = (validationError) => {
  return validationError.issues.reduce((acc, issue) => {
    const path = issue.path.join('.');
    acc[path] = issue.message;
    return acc;
  }, {});
};

const getFieldError = (property, value) => {
  const result = ConfirmSchema.safeParse({ [property]: value });
  if (!result.success) {
    return getErrors(result.error)[property];
  }
  return '';
};

export default function Register() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [formState, setFormState] = useState({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    setIsLoading(true);
    setSubmitError(null);

    const { error: validationError, data } = ConfirmSchema.safeParse(formState);

    if (validationError) {
      const errors = getErrors(validationError);
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            username: data.username,
          },
        },
      });

      if (signUpError) throw signUpError;

      console.log('Registration successful! Please check your email.');
    } catch (error) {
      setSubmitError(error.message || 'An error occurred during registration.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onBlur = (property) => () => {
    if (!touchedFields[property]) {
      const message = getFieldError(property, formState[property]);
      setFormErrors((prev) => ({ ...prev, [property]: message }));
      setTouchedFields((prev) => ({ ...prev, [property]: true }));
    }
  };

  const isInvalid = (property) => {
    return (formSubmitted || touchedFields[property]) && !!formErrors[property];
  };

  const handleChange = (property) => (e) => {
    setFormState((prev) => ({
      ...prev,
      [property]: e.target.value,
    }));

    if (touchedFields[property]) {
      const message = getFieldError([property, e.target.value]);
      setFormErrors((prev) => ({ ...prev, [property]: message }));
    }
  };

  const handleLoginClick = () => {
    // This is a placeholder since we are in a single file.
    // In a full-fledged app, this would use React Router to navigate to the login page.
    console.log('Navigating to the Login page.');
    // Example: navigate('/login');
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Register
        </h2>
        {submitError && (
          <div className="bg-red-900 text-red-200 p-3 rounded-lg text-sm mb-4">
            {submitError}
          </div>
        )}
        <form onSubmit={onSubmit} noValidate>
          {/* email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formState.email}
              onChange={handleChange('email')}
              onBlur={onBlur('email')}
              aria-invalid={isInvalid('email')}
              required
              className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isInvalid('email') ? 'border-red-500' : ''
              }`}
            />
            {isInvalid('email') && (
              <small className="text-red-400 text-sm mt-1 block">
                {formErrors.email}
              </small>
            )}
          </div>

          {/* firstName */}
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={formState.firstName}
              onChange={handleChange('firstName')}
              onBlur={onBlur('firstName')}
              aria-invalid={isInvalid('firstName')}
              required
              className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isInvalid('firstName') ? 'border-red-500' : ''
              }`}
            />
            {isInvalid('firstName') && (
              <small className="text-red-400 text-sm mt-1 block">
                {formErrors.firstName}
              </small>
            )}
          </div>

          {/* lastName */}
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={formState.lastName}
              onChange={handleChange('lastName')}
              onBlur={onBlur('lastName')}
              aria-invalid={isInvalid('lastName')}
              required
              className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isInvalid('lastName') ? 'border-red-500' : ''
              }`}
            />
            {isInvalid('lastName') && (
              <small className="text-red-400 text-sm mt-1 block">
                {formErrors.lastName}
              </small>
            )}
          </div>

          {/* username */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formState.username}
              onChange={handleChange('username')}
              onBlur={onBlur('username')}
              aria-invalid={isInvalid('username')}
              required
              className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isInvalid('username') ? 'border-red-500' : ''
              }`}
            />
            {isInvalid('username') && (
              <small className="text-red-400 text-sm mt-1 block">
                {formErrors.username}
              </small>
            )}
          </div>

          {/* password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formState.password}
              onChange={handleChange('password')}
              onBlur={onBlur('password')}
              aria-invalid={isInvalid('password')}
              required
              className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isInvalid('password') ? 'border-red-500' : ''
              }`}
            />
            {isInvalid('password') && (
              <small className="text-red-400 text-sm mt-1 block">
                {formErrors.password}
              </small>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 mt-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <button
            onClick={handleLoginClick}
            className="text-blue-400 font-medium hover:underline focus:outline-none"
          >
            <Link to="/login">Login here</Link>
          </button>
        </p>
      </div>
    </div>
  );
}
