import mongoose from "mongoose";

/** True when Mongoose has an active connection to MongoDB. */
export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}
