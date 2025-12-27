import mongoose from "mongoose";
import { Resume } from "@resume-buddy/schemas";

export interface IResume {
  user: mongoose.Types.ObjectId;
  content: Resume;
  version : number;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new mongoose.Schema<IResume>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    content: { type: Object, required: true, default: {} },
    version: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

export const ResumeModel = mongoose.model<IResume>("Resume", ResumeSchema);