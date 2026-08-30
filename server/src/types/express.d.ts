import type { AccessTokenPayload } from "@/modules/auth/auth.validation";
import type { IUser } from "@/models/user.model";

declare global {
  namespace Express {
    interface Request {
      // AccessTokenPayload for JWT auth, IUser for Passport OAuth
      user?: AccessTokenPayload | IUser;
    }
  }
}
