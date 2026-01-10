import mongoose from "mongoose";
import { AIInput, AIOutput } from "@resume-buddy/schemas";
import crypto from "crypto";

export interface ISuggestion {
  user: mongoose.Types.ObjectId;
  id: string;
  job: AIInput;
  aiResponse: AIOutput;
  resumeVersion: number;
  status: "completed";
  createdAt: Date;
  updatedAt: Date;
}

const SuggestionSchema = new mongoose.Schema<ISuggestion>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: String, requiered: true, default: crypto.randomUUID },
    job: { type: Object, required: true },
    status: { type: String, enum: ["completed"], default: "completed" },
    aiResponse: { type: Object, required: true },
    resumeVersion: { type: Number, required: true },
  },
  { timestamps: true }
);

export const SuggestionModel = mongoose.model<ISuggestion>("Suggestion", SuggestionSchema);
