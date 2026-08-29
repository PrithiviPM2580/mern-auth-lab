import mongoose from "mongoose";
import { appConfig } from "@/config/app.config";

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(appConfig.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
