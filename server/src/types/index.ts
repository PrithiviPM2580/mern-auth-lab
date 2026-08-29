import type { Request, Response } from "express";

export type TypeRequest<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown,
> = Request<TParams, unknown, TBody, TQuery>;

export interface AuthenticationCookiesPayload {
  res: Response;
  accessToken: string;
  refreshToken: string;
}
