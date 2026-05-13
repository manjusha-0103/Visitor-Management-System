
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // Detailed error for developers
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production: Leaner error for users
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Non-operational: Don't leak implementation details
      console.error('ERROR 💥', err); // Log full error to server logs
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }
  }
};
