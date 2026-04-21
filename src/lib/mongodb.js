import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Reusable Atlas connection for API routes and Server Components.
 * @returns {Promise<typeof mongoose>}
 */
export default async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set.");
  }
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
