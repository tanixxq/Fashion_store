import mongoose from "mongoose";

const LOCAL_DEV_URI = "mongodb://127.0.0.1:27017/dripkart";

const connectOptions = {
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 45000,
};

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment");
  }

  mongoose.set("strictQuery", true);
  // Fail fast when disconnected instead of buffering for 10s per query
  mongoose.set("bufferCommands", false);

  const tryConnect = async (connectionUri, label) => {
    await mongoose.connect(connectionUri, connectOptions);
    console.log(`MongoDB connected ✅${label ? ` (${label})` : ""}`);
  };

  try {
    await tryConnect(uri);
    return;
  } catch (error) {
    console.log("MongoDB connection failed ❌");
    console.log(error.message);

    const isDev = process.env.NODE_ENV !== "production";
    const isAtlas = uri.includes("mongodb+srv://");
    const localUri = process.env.MONGODB_URI_LOCAL || LOCAL_DEV_URI;

    if (isDev && isAtlas && localUri !== uri) {
      console.warn("[DB] Atlas unreachable — trying local MongoDB (127.0.0.1:27017)…");
      try {
        await mongoose.disconnect().catch(() => {});
        await tryConnect(localUri, "local fallback");
        return;
      } catch (localErr) {
        console.warn(`[DB] Local fallback failed: ${localErr.message}`);
      }
    }

    throw error;
  }
}
