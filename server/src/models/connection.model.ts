import { Schema, model, Document, Types } from "mongoose";

export interface IConnection extends Document {
  from: Types.ObjectId;
  to: Types.ObjectId;
  status: "pending" | "connected";
}

const ConnectionSchema = new Schema<IConnection>(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "connected"],
      default: "connected",
    },
  },
  { timestamps: true }
);

export const Connection = model<IConnection>("Connection", ConnectionSchema);
export default Connection;
