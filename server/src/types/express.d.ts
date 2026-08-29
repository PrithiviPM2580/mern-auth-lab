import type { AccessTokenPayload } from "@/modules/auth/auth.validation";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}
