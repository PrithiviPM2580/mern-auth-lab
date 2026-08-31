import { authenticate } from "@/middleware/authenticate.middleware";
import { asyncHandler } from "@/middleware/async-handler.middleware";
import { twoFactorController } from "./two-factor.controller";
import { Router } from "express";
import { validateRequest } from "@/middleware/validate-request.middleware";
import { twoFactorSchema } from "./two-factor.validation";

const twoFactorRouter: Router = Router();

twoFactorRouter
  .route("/setup-totp")
  .post(authenticate, asyncHandler(twoFactorController.setupTotp));

twoFactorRouter
  .route("/verify-totp")
  .post(
    authenticate,
    validateRequest({ body: twoFactorSchema }),
    asyncHandler(twoFactorController.verifyAndEnableTotp),
  );

twoFactorRouter
  .route("/disable-totp")
  .post(
    authenticate,
    validateRequest({ body: twoFactorSchema }),
    asyncHandler(twoFactorController.disableTotp),
  );

export default twoFactorRouter;
