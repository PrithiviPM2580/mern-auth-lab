import { asyncHandler } from "@/middleware/async-handler.middleware";
import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "@/middleware/validate-request.middleware";
import { registerSchema } from "./auth.validation";

const authRouter: Router = Router();

authRouter
  .route("/register")
  .post(
    validateRequest({ body: registerSchema }),
    asyncHandler(authController.register),
  );

export default authRouter;
