import APIError from './APIError';

class ResponseFormatter {
  static badRequest(message: string): never {
    throw new APIError(message, 400);
  }

  static unauthorized(message: string): never {
    throw new APIError(message, 401);
  }

  static forbidden(message: string): never {
    throw new APIError(message, 403);
  }

  static notFound(message: string): never {
    throw new APIError(message, 404);
  }

  static conflict(message: string): never {
    throw new APIError(message, 409);
  }

  static internalError(message: string): never {
    throw new APIError(message, 500);
  }
}

export default ResponseFormatter;
