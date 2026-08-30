import type { AccessTokenPayload } from "@/modules/auth/auth.validation";
import type { IUser } from "@/models/user.model";

declare global {
  namespace Express {
    interface Request {
      auth?: AccessTokenPayload;
      user?: IUser;
    }
  }
}
