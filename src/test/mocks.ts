import 'jest'
import { Request, Response } from 'express'

// A mock for express Request
export const mockRequest = (): Partial<Request> => ({
  body: {},
  params: {},
});

// A mock for express Response
export const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.render = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
};
