module.exports = {
  successResponse: (res, message, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      statusCode,
    });
  },

  errorResponse: (res, message, data = [], statusCode = 500) => {
    return res.status(statusCode).json({
      success: false,
      message,
      data,
      statusCode,
    });
  }
};
