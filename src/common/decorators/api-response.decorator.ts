import { BaseResponse } from '../base-response';

export const ApiResponse = <T>(
  data: T,
  message?: string,
  statusCode?: number,
): BaseResponse<T> => {
  return BaseResponse.success(data, message, statusCode);
};

export const ApiError = <T>(
  message: string,
  statusCode: number = 500,
  data?: T,
): BaseResponse<T> => {
  return BaseResponse.error(message, statusCode, data);
};
