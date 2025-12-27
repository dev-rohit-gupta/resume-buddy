import mongoose from "mongoose";
import { Resume } from "@resume-buddy/schemas";
import { urlSchema } from "@resume-buddy/schemas";
import z from "zod";

export interface IResume {
  user: mongoose.Types.ObjectId;
  url : z.infer<typeof urlSchema>;
  id : string;
  content: Resume;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new mongoose.Schema<IResume>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    url: { type: String, required: true },
    id: { type: String, required: true },
    content: { type: Object, required: true, default: {} },
    version: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

export const ResumeModel = mongoose.model<IResume>("Resume", ResumeSchema);
