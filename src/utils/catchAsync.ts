import { Request, Response, NextFunction, RequestHandler } from 'express';

// func is expected to be a function that takes Request, Response, Next and returns a Promise.
// since the handler sends the response via res or calls next, it doesn’t return a meaningful value.
type asyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// catchAsync is expected to be a standard express middleware function.
// express defines this as RequestHandler
export default (func: asyncRequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) =>
    func(req, res, next).catch((err) => next(err));
