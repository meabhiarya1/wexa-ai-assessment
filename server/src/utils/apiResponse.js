export class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    this.data = data;
  }
}

export function sendSuccess(res, data, message = "Success", statusCode = 200) {
  return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
}
