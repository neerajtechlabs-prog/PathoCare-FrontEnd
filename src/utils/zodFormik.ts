import { z } from 'zod';

export const toFormikValidationSchema = (schema: z.ZodSchema<any>) => {
  return {
    validate: async (values: any) => {
      try {
        await schema.parseAsync(values);
        return {};
      } catch (err) {
        if (err instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          err.issues.forEach((issue) => {
            if (issue.path.length > 0) {
              errors[issue.path[0] as string] = issue.message;
            }
          });
          return errors;
        }
        throw err;
      }
    },
  };
};

/**
 * A simpler helper that can be used directly in Formik's `validate` prop
 */
export const validateWithZod = (schema: z.ZodSchema<any>) => (values: any) => {
  const result = schema.safeParse(values);
  if (result.success) return {};
  
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    if (issue.path.length > 0) {
      errors[issue.path[0] as string] = issue.message;
    }
  });
  return errors;
};
