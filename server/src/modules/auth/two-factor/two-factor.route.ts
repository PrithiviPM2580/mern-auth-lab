import { authenticate } from "@/middleware/authenticate.middleware";
import { asyncHandler } from "@/middleware/async-handler.middleware";
import { twoFactorController } from "./two-factor.controller";
import { Router } from "express";
import { validateRequest } from "@/middleware/validate-request.middleware";
import { twoFactorSchema } from "./two-factor.validation";
import { twoFactorRateLimiter } from "@/middleware/rate-limiting.middleware";

const twoFactorRouter: Router = Router();

twoFactorRouter
  .route("/setup-totp")
  .post(
    authenticate,
    twoFactorRateLimiter,
    asyncHandler(twoFactorController.setupTotp),
  );

twoFactorRouter
  .route("/verify-totp")
  .post(
    authenticate,
    twoFactorRateLimiter,
    validateRequest({ body: twoFactorSchema }),
    asyncHandler(twoFactorController.verifyAndEnableTotp),
  );

twoFactorRouter
  .route("/disable-totp")
  .post(
    authenticate,
    twoFactorRateLimiter,
    validateRequest({ body: twoFactorSchema }),
    asyncHandler(twoFactorController.disableTotp),
  );

twoFactorRouter
  .route("/regenerate-recovery-codes")
  .post(
    authenticate,
    twoFactorRateLimiter,
    asyncHandler(twoFactorController.regenerateRecoveryCodes),
  );

export default twoFactorRouter;
