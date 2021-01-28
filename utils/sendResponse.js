module.exports = (validation, res, message, statusCode = 200) => {
  res.status(statusCode).json({
    status: "success",
    message,
    data: {
      validation,
    },
  });
};
