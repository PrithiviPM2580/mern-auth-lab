import { formatZodError } from "@/errors/zod.error";
import { type Schemas, validate } from "zod-express-validator";
import { type RequestHandler } from "express";
import { type ParamsDictionary } from "express-serve-static-core";

export const validateRequest = (schemas: Schemas) => {
  return validate(schemas, ({ bodyError, paramsError, queryError }, res) => {
    const error = bodyError ?? paramsError ?? queryError;

    if (error) {
      return formatZodError(res, error);
    }

    return res.status(400).json({
      message: "Validation Error",
    });
  });
};

export const validateRequestWithParams = <
  P extends ParamsDictionary = ParamsDictionary,
>(
  schemas: Schemas,
): RequestHandler<P> => {
  return validate(schemas, ({ bodyError, paramsError, queryError }, res) => {
    const error = bodyError ?? paramsError ?? queryError;

    if (error) {
      return formatZodError(res, error);
    }

    return res.status(400).json({
      message: "Validation Error",
    });
  }) as RequestHandler<P>;
};
