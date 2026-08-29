import { asyncHandler } from "@/middleware/async-handler.middleware";
import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "@/middleware/validate-request.middleware";
import { loginSchema, registerSchema } from "./auth.validation";

const authRouter: Router = Router();

authRouter
  .route("/register")
  .post(
    validateRequest({ body: registerSchema }),
    asyncHandler(authController.register),
  );

authRouter
  .route("/login")
  .post(
    validateRequest({ body: loginSchema }),
    asyncHandler(authController.login),
  );

authRouter.route("/refresh").post(asyncHandler(authController.refresh));

authRouter.route("/logout").post(asyncHandler(authController.logout));

export default authRouter;
