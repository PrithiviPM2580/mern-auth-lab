import { appConfig } from "@/config/app.config";
import type { Request, RequestHandler } from "express";
import { doubleCsrf } from "csrf-csrf";

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => appConfig.CSRF_SECRET,
  getSessionIdentifier: (req: Request) => req.ip ?? "unknown",
  cookieName: "csrfToken",
  cookieOptions: {
    httpOnly: false,
    secure: appConfig.NODE_ENV === "production",
    sameSite: appConfig.NODE_ENV === "production" ? "strict" : "lax",
  },
  getCsrfTokenFromRequest: (req: Request) =>
    req.headers["x-csrf-token"] as string,
});

export { generateCsrfToken, doubleCsrfProtection };
