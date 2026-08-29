import { appConfig } from "@/config/app.config";
import ms, { type StringValue } from "ms";

export const expireIn = () => {
  return new Date(
    Date.now() + ms(appConfig.JWT_REFRESH_EXPIRES_IN as StringValue),
  );
};
