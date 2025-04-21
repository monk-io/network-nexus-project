import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  sub: string;
  username: string;
  name: string;
  title: string;
  avatarUrl: string;
  bio?: string;
  location?: string;
}

const UserSchema = new Schema<IUser>(
  {
    sub: { type: String, required: true, unique: true, index: true },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    name: { type: String, required: true },
    title: { type: String },
    avatarUrl: { type: String },
    bio: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
export default User;
