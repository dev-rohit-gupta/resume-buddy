import mongoose from "mongoose";
import { Resume } from "@resume-buddy/schemas";

export interface IResume {
  user: mongoose.Types.ObjectId;

  id: string;
  resourceType: string;
  extension: string;

  // ===== Extracted / Parsed Resume Content =====
  content: Resume;

  // ===== Career Analysis (SOURCE OF TRUTH) =====
  atsScore: number;
  bestRole: string;
  nearestNextRole: string;
  skillGaps: string[];

  // ===== Meta =====
  version: number;
  analysedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new mongoose.Schema<IResume>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    id: {
      type: String,
      required: true
    },

    resourceType: {
      type: String,
      required: true
    },

    extension: {
      type: String,
      required: true
    },

    content: {
      type: Object,
      required: true,
      default: {}
    },

    // ---------- Career Analysis ----------
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },

    bestRole: {
      type: String,
      default: "N/A"
    },

    nearestNextRole: {
      type: String,
      default: "N/A"
    },

    skillGaps: {
      type: [String],
      default: []
    },

    analysedAt: {
      type: Date
    },

    // ---------- Meta ----------
    version: {
      type: Number,
      required: true,
      default: 1
    }
  },
  { timestamps: true }
);

export const ResumeModel = mongoose.model<IResume>(
  "Resume",
  ResumeSchema
);
