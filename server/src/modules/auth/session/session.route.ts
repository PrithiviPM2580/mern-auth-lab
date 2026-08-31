import { asyncHandler } from "@/middleware/async-handler.middleware";
import { authenticate } from "@/middleware/authenticate.middleware";
import { Router } from "express";
import { sessionController } from "./session.controller";
import { doubleCsrfProtection } from "@/middleware/csrf.middleware";
import { validateRequestWithParams } from "@/middleware/validate-request.middleware";
import { sessionParamsSchema, type SessionParams } from "./session.validation";

const sessionRouter: Router = Router();

sessionRouter
  .route("/")
  .get(authenticate, asyncHandler(sessionController.getSessions));

sessionRouter
  .route("/")
  .delete(
    authenticate,
    doubleCsrfProtection,
    asyncHandler(sessionController.revokeAllSessions),
  );

sessionRouter.route("/:sessionId").delete(
  authenticate,
  doubleCsrfProtection,
  validateRequestWithParams<SessionParams>({
    params: sessionParamsSchema,
  }),
  asyncHandler(sessionController.revokeSession),
);

export default sessionRouter;
