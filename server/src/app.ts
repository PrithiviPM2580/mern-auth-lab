import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";

import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { appConfig } from "./config/app.config";
import { errorHandler } from "./middleware/error-handler.middleware";

const app: Application = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
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

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
