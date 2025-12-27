import mongoose from "mongoose";
import { AIInput , AIOutput } from "@resume-buddy/schemas";

export interface ISuggestion {
  user: mongoose.Types.ObjectId;
  job: AIInput;
  aiResponse: AIOutput;
  resumeVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const SuggestionSchema = new mongoose.Schema<ISuggestion>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: Object, required: true },
    aiResponse: { type: Object, required: true },
    resumeVersion: { type: Number, required: true },
}, { timestamps: true });

export const SuggestionModel = mongoose.model<ISuggestion>("Suggestion", SuggestionSchema);