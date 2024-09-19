export const sendErrorResponse = (data, responseData) => {
  return {
    Message: data.message || 'Error occured',
    Code: data.code || '00',
    ...responseData,
  };
};

export const sendSuccessResponse = (responseData) => {
  return {
    Message: 'Success',
    Code: '00',
    ...responseData,
  };
};
