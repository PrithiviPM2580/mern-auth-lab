import { HTTP_STATUS, type HTTP_STATUS_CODE } from "@/config/http.config";

import { ERROR_CODE, type ErrorCode } from "@/constants/error-code.constant";

export class AppError extends Error {
  public readonly statusCode: HTTP_STATUS_CODE;
  public readonly errorCode?: ErrorCode;

  constructor(
    message: string,
    statusCode: HTTP_STATUS_CODE = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCode,
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, AppError);
  }

  static badRequest(message = "Bad request", errorCode?: ErrorCode) {
    return new AppError(message, HTTP_STATUS.BAD_REQUEST, errorCode);
  }

  static unauthorized(
    message = "Unauthorized",
    errorCode = ERROR_CODE.ACCESS_UNAUTHORIZED,
  ) {
    return new AppError(message, HTTP_STATUS.UNAUTHORIZED, errorCode);
  }

  static notFound(
    message = "Resource not found",
    errorCode = ERROR_CODE.RESOURCE_NOT_FOUND,
  ) {
    return new AppError(message, HTTP_STATUS.NOT_FOUND, errorCode);
  }

  static conflict(message = "Conflict", errorCode?: ErrorCode) {
    return new AppError(message, HTTP_STATUS.CONFLICT, errorCode);
  }

  static internalServer(
    message = "Internal server error",
    errorCode = ERROR_CODE.INTERNAL_SERVER_ERROR,
  ) {
    return new AppError(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, errorCode);
  }
}
