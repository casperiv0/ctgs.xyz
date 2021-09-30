import { z, ZodError } from "zod";

export async function validate(values: any) {
  const schema = z.object({
    url: z.string().url().min(4),
    slug: z.string().min(3),
  });

  try {
    schema.parse(values);

    return {};
  } catch (e) {
    const err = e as ZodError<typeof schema>;
    const errors: Record<string, string> = {};

    for (const error of err.errors) {
      const [path] = error.path;
      errors[path as string] = error.message;
    }

    return errors;
  }
}
