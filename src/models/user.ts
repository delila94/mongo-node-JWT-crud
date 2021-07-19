import { Document, Schema, Model, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
}

export const userSchema: Schema = new Schema({
  email: String,
  password: String,
});

export const User: Model<IUser> = model<IUser>("User", userSchema);
