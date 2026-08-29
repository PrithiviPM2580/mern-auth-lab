import { formatZodError } from "@/errors/zod.error";
import { type Schemas, validate } from "zod-express-validator";

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
