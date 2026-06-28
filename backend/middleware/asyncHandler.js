/**
 * Wraps an async route handler so any rejected promise / thrown error
 * is forwarded to Express's `next()` instead of crashing the process.
 * This lets the centralized errorHandler middleware deal with it.
 *
 * Usage: router.get("/", asyncHandler(controllerFn));
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
