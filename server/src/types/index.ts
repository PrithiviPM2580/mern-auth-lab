import type { ParamsDictionary } from "express-serve-static-core";
import type { Request, Response } from "express";
import type { ParsedQs } from "qs";

export type TypeRequest<
  TBody = unknown,
  TParams = ParamsDictionary,
  TQuery = ParsedQs,
> = Request<TParams, unknown, TBody, TQuery>;

export interface AuthenticationCookiesPayload {
  res: Response;
  accessToken: string;
  refreshToken: string;
}
