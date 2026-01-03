import mongoose, { Schema } from "mongoose";

export interface IJobStats extends mongoose.Document {
  user: mongoose.Types.ObjectId;

  // Job stats
  totalMatched: number;
  thisWeekMatched: number;
  previousWeekMatched: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobStatsSchema = new Schema<IJobStats>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    totalMatched: { type: Number, default: 0, min: 0 },
    thisWeekMatched: { type: Number, default: 0, min: 0 },
    previousWeekMatched: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const JobStatsModel = mongoose.model<IJobStats>("JobStats", JobStatsSchema);
