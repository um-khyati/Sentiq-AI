const { z } = require("zod");

/**
 * Schemas describing exactly what /register and /login accept.
 * Keeping them here (rather than inline in the controller) means the
 * same rules back both the API and, if needed later, any server-side
 * form re-validation.
 */
const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name cannot exceed 120 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"), // bcrypt silently truncates beyond 72 bytes
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address"),
  password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
});

/**
 * validate(schema)
 *
 * Generic middleware factory: parses req.body against the given zod
 * schema. On success, req.body is replaced with the parsed (and
 * trimmed/lower-cased where applicable) data. On failure, responds
 * 400 with a readable list of field errors — never reaches the
 * controller or the database.
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join(", ");
    return res.status(400).json({ success: false, message });
  }

  req.body = result.data;
  next();
};

module.exports = { registerSchema, loginSchema, validate };
