import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/mongodb";
import WeeklyEntry from "../../../models/WeeklyEntry";

// GET all entries
export async function GET() {
  try {
    await connectToDB();
    const entries = await WeeklyEntry.find({}).sort({ week_start: -1 });
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new entry
export async function POST(request) {
  try {
    await connectToDB();
    const body = await request.json();
    
    const newEntry = await WeeklyEntry.create(body);
    return NextResponse.json(newEntry);
  } catch (error) {
    console.error("Error creating entry:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update entry
export async function PUT(request) {
  try {
    await connectToDB();
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const updatedEntry = await WeeklyEntry.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("Error updating entry:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE entry
export async function DELETE(request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    const deletedEntry = await WeeklyEntry.findByIdAndDelete(id);
    
    if (!deletedEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting entry:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}