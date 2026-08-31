import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import twoFactorRouter from "./modules/auth/two-factor/two-factor.route";
import { errorHandler } from "./middleware/error-handler.middleware";
import sessionRouter from "./modules/auth/session/session.route";
import oauthRouter from "./modules/auth/oauth/oauth.route";
import authRouter from "./modules/auth/auth.route";
import passport from "@/config/passport.config";
import { appConfig } from "./config/app.config";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

const app: Application = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(
  cors({
    origin: appConfig.APP_ORIGIN,
    credentials: true,
  }),
);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Advance MERN Auth API",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    message: "API is healthy",
  });
});

app.use(`${appConfig.BASE_PATH}/auth`, authRouter);
app.use(`${appConfig.BASE_PATH}/2fa`, twoFactorRouter);
app.use(`${appConfig.BASE_PATH}/auth/sessions`, sessionRouter);
app.use(`${appConfig.BASE_PATH}/auth/oauth`, oauthRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
