import mongoose from "mongoose";
import { Resume } from "@resume-buddy/schemas";
import { GeneralAtsReport } from "@resume-buddy/schemas";
export interface IResume {
  user: mongoose.Types.ObjectId;

  key: string;
  resourceType: string;

  // ===== Extracted / Parsed Resume Content =====
  content: Resume;

  // ===== Career Analysis (SOURCE OF TRUTH) =====
  atsAnalysis: GeneralAtsReport;
  bestRole: string;
  nearestNextRole: string;
  skillGaps: string[];
  
  // ===== Meta =====
  version: number;
  analyzedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new mongoose.Schema<IResume>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    key: {
      type: String,
      required: true,
    },

    resourceType: {
      type: String,
      required: true,
    },

    content: {
      type: Object,
      required: true,
      default: {},
    },

    // ---------- Career Analysis ----------
    atsAnalysis: {
      type: Object,
      required: true,
      default: {},
    },

    bestRole: {
      type: String,
      default: "N/A",
    },

    nearestNextRole: {
      type: String,
      default: "N/A",
    },

    skillGaps: {
      type: [String],
      default: [],
    },

    analyzedAt: {
      type: Date,
    },

    // ---------- Meta ----------
    version: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

export const ResumeModel = mongoose.model<IResume>("Resume", ResumeSchema);
