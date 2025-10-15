const successResponse = (res, message, data = [], statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    statusCode,
  });
};

const errorResponse = (res, message, data = [], statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data,
    statusCode,
  });
};

export default {
  successResponse,
  errorResponse
};
