import mongoose from "mongoose";
import { env } from "./env.config.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGO_URI);
  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
