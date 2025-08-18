import { useState } from 'react';
import { useNavigate } from 'react-router';
import supabase from '../supabase/supabase-client';
import { ConfirmSchema, getErrors, getFieldError } from '../lib/validationForm';

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

  const navigate = useNavigate();

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

      alert(
        'Registration successful! Please check your email for verification.'
      );
      navigate('/login');
    } catch (error) {
      setSubmitError(error.message || 'An error occurred during registration.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onBlur = (property) => () => {
    if (!touchedFields[property]) {
      const message = getFieldError(
        [property, formState[property]],
        ConfirmSchema
      );
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
      const message = getFieldError([property, e.target.value], ConfirmSchema);
      setFormErrors((prev) => ({ ...prev, [property]: message }));
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      {submitError && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>{submitError}</div>
      )}
      <form onSubmit={onSubmit} noValidate>
        {/* email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formState.email}
            onChange={handleChange('email')}
            onBlur={onBlur('email')}
            aria-invalid={isInvalid('email')}
            required
            className={isInvalid('email') ? 'invalid' : ''}
          />
          {isInvalid('email') && (
            <small className="error-text">{formErrors.email}</small>
          )}
        </div>

        {/* firstName */}
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={formState.firstName}
            onChange={handleChange('firstName')}
            onBlur={onBlur('firstName')}
            aria-invalid={isInvalid('firstName')}
            required
            className={isInvalid('firstName') ? 'invalid' : ''}
          />
          {isInvalid('firstName') && (
            <small className="error-text">{formErrors.firstName}</small>
          )}
        </div>

        {/* lastName */}
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={formState.lastName}
            onChange={handleChange('lastName')}
            onBlur={onBlur('lastName')}
            aria-invalid={isInvalid('lastName')}
            required
            className={isInvalid('lastName') ? 'invalid' : ''}
          />
          {isInvalid('lastName') && (
            <small className="error-text">{formErrors.lastName}</small>
          )}
        </div>

        {/* username */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={formState.username}
            onChange={handleChange('username')}
            onBlur={onBlur('username')}
            aria-invalid={isInvalid('username')}
            required
            className={isInvalid('username') ? 'invalid' : ''}
          />
          {isInvalid('username') && (
            <small className="error-text">{formErrors.username}</small>
          )}
        </div>

        {/* password */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formState.password}
            onChange={handleChange('password')}
            onBlur={onBlur('password')}
            aria-invalid={isInvalid('password')}
            required
            className={isInvalid('password') ? 'invalid' : ''}
          />
          {isInvalid('password') && (
            <small className="error-text">{formErrors.password}</small>
          )}
        </div>

        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? 'Processing...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
