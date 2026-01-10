import { connectToDB } from "../../../lib/mongodb";
import mongoose from "mongoose";

const FacilitatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  assigned_hours: { type: Number, default: 0 }, // <-- added assigned hours
});

const Facilitator = mongoose.models.Facilitator || mongoose.model("Facilitator", FacilitatorSchema);

export async function GET() {
  try {
    await connectToDB();
    const facilitators = await Facilitator.find();
    return new Response(JSON.stringify(facilitators), { status: 200 });
  } catch (err) {
    console.error("Error fetching facilitators:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const data = await req.json();

    // Ensure assigned_hours is saved even if not provided from UI
    if (!data.assigned_hours) data.assigned_hours = 0;

    const facilitator = new Facilitator(data);
    await facilitator.save();
    return new Response(JSON.stringify(facilitator), { status: 201 });
  } catch (err) {
    console.error("Error creating facilitator:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDB();
    const { id } = req.query;
    const data = await req.json();
    const updatedFacilitator = await Facilitator.findByIdAndUpdate(id, data, { new: true });
    return new Response(JSON.stringify(updatedFacilitator), { status: 200 });
  } catch (err) {
    console.error("Error updating facilitator:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
