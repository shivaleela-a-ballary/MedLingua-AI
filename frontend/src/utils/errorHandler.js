export class AppError extends Error {
  constructor(message, statusCode, type = 'general') {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = true;
  }
}

export const errorTypes = {
  AUTH: 'authentication',
  NETWORK: 'network',
  VALIDATION: 'validation',
  SERVER: 'server',
  GENERAL: 'general'
};

export const handleApiError = (error, res) => {
  if (!res) {
    return new AppError(
      'Unable to connect to server. Please check your internet connection.',
      0,
      errorTypes.NETWORK
    );
  }

  if (res.status === 401 || res.status === 403) {
    return new AppError(
      'Session expired. Please login again.',
      res.status,
      errorTypes.AUTH
    );
  }

  if (res.status === 400) {
    return new AppError(
      error.message || 'Invalid input. Please check your data.',
      400,
      errorTypes.VALIDATION
    );
  }

  if (res.status >= 500) {
    return new AppError(
      'Server error. Please try again later.',
      res.status,
      errorTypes.SERVER
    );
  }

  return new AppError(
    error.message || 'Something went wrong',
    res.status || 500,
    errorTypes.GENERAL
  );
};