class AppError extends Error {
  constructor(message, statusCode, status = "error") {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
  }
}

module.exports = AppError;
