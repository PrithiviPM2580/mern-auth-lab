import { authenticate } from "@/middleware/authenticate.middleware";
import { asyncHandler } from "@/middleware/async-handler.middleware";
import { twoFactorController } from "./two-factor.controller";
import { Router } from "express";

const twoFactorRouter: Router = Router();

twoFactorRouter
  .route("/setup-totp")
  .post(authenticate, asyncHandler(twoFactorController.setupTotp));

export default twoFactorRouter;
