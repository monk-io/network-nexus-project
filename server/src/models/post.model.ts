import { Schema, model, Document, Types } from "mongoose";

export interface IPost extends Document {
  author: Types.ObjectId;
  content: string;
  imageUrl?: string;
  timestamp: Date;
  likes: number;
  comments: number;
}

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    timestamp: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Post = model<IPost>("Post", PostSchema);
export default Post;
