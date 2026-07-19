/**
 * validate(schema)
 *
 * Generic middleware factory: parses req.body against a given zod
 * schema. On success, req.body is replaced with the parsed (trimmed /
 * coerced) data. On failure, responds 400 with a readable list of field
 * errors — never reaches the controller, the database, or (for the AI
 * routes) the paid/rate-limited external API.
 *
 * Shared by backend/validators/authValidators.js and
 * backend/validators/aiValidators.js so both auth and AI routes validate
 * the same way.
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

module.exports = { validate };
