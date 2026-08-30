import { authenticate } from "@/middleware/authenticate.middleware";
import { asyncHandler } from "@/middleware/async-handler.middleware";
import { twoFactorController } from "./two-factor.controller";
import { Router } from "express";

const twoFactorRouter: Router = Router();

twoFactorRouter
  .route("/setup-totp")
  .post(authenticate, asyncHandler(twoFactorController.setupTotp));

twoFactorRouter
  .route("/verify-totp")
  .post(authenticate, asyncHandler(twoFactorController.verifyAndEnableTotp));

export default twoFactorRouter;
