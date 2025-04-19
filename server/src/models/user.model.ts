import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  sub: string;
  name: string;
  title: string;
  avatarUrl: string;
  bio?: string;
}

const UserSchema = new Schema<IUser>(
  {
    sub: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    bio: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
export default User;
