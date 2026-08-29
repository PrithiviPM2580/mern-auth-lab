import "dotenv/config";
import app from "./app";
import { appConfig } from "./config/app.config";
import { connectToDatabase } from "./database/database";

const PORT = appConfig.PORT || 3000;

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(
    `Server is running in env [${appConfig.NODE_ENV}] at [http://localhost:${PORT}]`,
  );
});
