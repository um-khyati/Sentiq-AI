/**
 * notFound — catches any request that didn't match a route and forwards
 * a 404 error into the centralized error handler below.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * errorHandler — single place where every error in the app is turned
 * into a consistent JSON response with the correct HTTP status code.
 * Must be registered LAST, after all routes.
 */
const errorHandler = (err, req, res, next) => {
  // Some errors (e.g. AIServiceError from the Gemini integration) carry
  // their own statusCode instead of the controller calling res.status()
  // before throwing — honor that first, then fall back to the older
  // convention used by the rest of the app.
  let statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || "Internal Server Error";

  // Mongoose: invalid ObjectId (e.g. /api/reviews/123)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found — invalid ID";
  }

  // Mongoose: schema validation failed
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // MongoDB: duplicate key (e.g. duplicate email on signup)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {}).join(", ");
    message = `Duplicate value for field: ${field}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Stack trace only in development, never expose it in production
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
