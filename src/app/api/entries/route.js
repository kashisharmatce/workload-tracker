// src/app/api/entries/route.js
import { connectToDB } from "../../../lib/mongodb";
import WeeklyEntry from "../../../models/WeeklyEntry";

// GET all entries
export async function GET() {
  try {
    await connectToDB();
    const entries = await WeeklyEntry.find().sort({ week_start: -1 });
    return new Response(JSON.stringify(entries), { status: 200 });
  } catch (err) {
    console.error("Error fetching entries:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST a new entry
export async function POST(req) {
  try {
    await connectToDB();
    const data = await req.json();
    const entry = new WeeklyEntry(data);
    await entry.save();
    return new Response(JSON.stringify(entry), { status: 201 });
  } catch (err) {
    console.error("Error creating entry:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// PUT (update) an existing entry
export async function PUT(req) {
  try {
    await connectToDB();
    const { id, ...data } = await req.json();
    const updatedEntry = await WeeklyEntry.findByIdAndUpdate(id, data, { new: true });
    return new Response(JSON.stringify(updatedEntry), { status: 200 });
  } catch (err) {
    console.error("Error updating entry:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// DELETE an entry
export async function DELETE(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await WeeklyEntry.findByIdAndDelete(id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error deleting entry:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
