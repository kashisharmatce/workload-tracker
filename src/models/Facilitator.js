import mongoose from "mongoose";

const FacilitatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Facilitator || mongoose.model("Facilitator", FacilitatorSchema);
