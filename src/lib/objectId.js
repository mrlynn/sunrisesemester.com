import mongoose from "mongoose";

export function isValidObjectIdString(id) {
  return mongoose.isValidObjectId(id);
}
