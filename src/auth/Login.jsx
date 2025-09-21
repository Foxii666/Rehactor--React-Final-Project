import React, { useState } from 'react';
import supabase from '../supabase/supabase-client';
import { Link } from 'react-router';

// A simple placeholder validation schema for the login form.
const ConfirmSchemaLogin = {
  safeParse: (data) => {
    const errors = {};
    if (!data.email) errors.email = 'Email is required.';
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
  const result = ConfirmSchemaLogin.safeParse({ [property]: value });
  if (!result.success) {
    return getErrors(result.error)[property];
  }
  return '';
};

export default function Login() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    setIsLoading(true);
    setFormErrors({});

    const result = ConfirmSchemaLogin.safeParse(formState);

    if (!result.success) {
      const errors = getErrors(result.error);
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      });

      if (error) {
        setFormErrors({ submit: error.message });
        setIsLoading(false);
        return;
      }

      console.log('Login successful!');
    } catch (err) {
      setFormErrors({ submit: err?.message || 'Unexpected error occurred' });
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
      const message = getFieldError(property, e.target.value);
      setFormErrors((prev) => ({ ...prev, [property]: message }));
    }
  };

  const handleRegisterClick = () => {
    // This is a placeholder since we are in a single file.
    console.log('Navigating to the Register page.');
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Login
        </h2>

        {formErrors.submit && (
          <div className="bg-red-900 text-red-200 p-3 rounded-lg text-sm mb-4">
            {formErrors.submit}
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
              name="email"
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
              name="password"
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
            {isLoading ? 'Processing...' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={handleRegisterClick}
            className="text-blue-400 font-medium hover:underline focus:outline-none"
          >
            <Link to="/register">Register here</Link>
          </button>
        </p>
      </div>
    </div>
  );
}
