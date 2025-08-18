import z from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
const passwordError =
  'Password must contain at least one uppercase letter, one lowercase letter, and one number.';

// Schema per registrazione (completo)
export const FormSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(passwordRegex, passwordError),
});

// Schema derivato per login (solo email + password)
export const FormSchemaLogin = FormSchema.pick({
  email: true,
  password: true,
});

export const ConfirmSchema = FormSchema;
export const ConfirmSchemaLogin = FormSchemaLogin;

export function getFieldError([property, value], schema = FormSchema) {
  const result = schema.shape[property].safeParse(value);
  if (!result.success) {
    return result.error.issues.map((issue) => issue.message).join(', ');
  }
  return undefined;
}

export function getErrors(error) {
  if (!error) return {};
  return error.issues.reduce((all, issue) => {
    const path = issue.path[0];
    all[path] = issue.message;
    return all;
  }, {});
}
