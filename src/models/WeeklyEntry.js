// src/models/WeeklyEntry.js
import mongoose from "mongoose";

const WeeklyEntrySchema = new mongoose.Schema(
  {
    facilitator_id: { type: String, required: true },
    week_start: { type: Date, required: true },
    contact_hours: { type: Number, required: true },
    non_contact_category: { type: String, required: true },
    non_contact_hours: { type: Number, required: true },
    comments: String,
  },
  { timestamps: true }
);

export default mongoose.models.WeeklyEntry ||
  mongoose.model("WeeklyEntry", WeeklyEntrySchema);
