import { useState } from 'react';
import { useNavigate } from 'react-router';
import supabase from '../supabase/supabase-client';
import {
  ConfirmSchemaLogin,
  getErrors,
  getFieldError,
} from '../lib/validationForm';

export default function Login() {
  const navigate = useNavigate();
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

      alert('Login successful!');
      navigate('/');
    } catch (err) {
      setFormErrors({ submit: err?.message || 'Unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const onBlur = (property) => () => {
    if (!touchedFields[property]) {
      const message = getFieldError([property, formState[property]]);
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

  return (
    <div className="container">
      <h2>Login</h2>

      {formErrors.submit && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {formErrors.submit}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
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

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
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
          {isLoading ? 'Processing...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
