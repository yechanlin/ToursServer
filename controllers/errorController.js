const AppError = require('../utils/apperror');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400); // Create an operational error with 400 Bad Request
};

const handleDuplicateError = (err) => {
  // Extract duplicate field value
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log('Duplicate Field Value:', value); // For debugging

  // Create user-friendly error message
  const message = `Duplicate field value: ${value}. Please use another value!`;

  // Return an AppError instance with a 400 status code
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = (err) =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

// module.exports = (err, req, res, next) => {
//   // console.log(err.stack);
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   if (process.env.NODE_ENV === 'development') {
//     sendErrorDev(err, res);
//   } else if (process.env.NODE_ENV === 'production') {
//     let error = Object.assign({}, err);
//     if (error.name === 'CastError') error = handleCastErrorDB(error);
//     sendErrorProd(error, res);
//   }
// };

module.exports = (err, req, res, next) => {
  console.error('Global Error:', err); // Log the full error for debugging

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // In development mode, send full error details
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    // Create a safe error object
    let error = Object.assign({}, err);

    // Properly handle specific errors
    if (error.name === 'CastError') {
      error = handleCastErrorDB(err); // Convert CastError to operational error
    }
    if (error.code === 11000) {
      error = handleDuplicateError(err);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationError(err);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError(err);
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError(err);
    }
    // Send appropriate production error response
    res.status(error.statusCode || 500).json({
      status: error.status,
      message: error.isOperational
        ? error.message
        : 'Something went very wrong!',
    });
  }
};
