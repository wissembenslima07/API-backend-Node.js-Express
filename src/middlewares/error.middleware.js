function notFoundHandler(_req, res) {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
}

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.message || "Internal server error",
  };

  if (Array.isArray(err.errors) && err.errors.length > 0) {
    payload.errors = err.errors;
  }

  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json({
    ...payload,
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
