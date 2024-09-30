import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Record from "@/models/slip";
import { NextRequest, NextResponse } from "next/server";

// Get all records for a specific user
export async function GET(req: NextRequest) {
  const userId = req.headers.get('userId');
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const records = await Record.find({ userId });
    return NextResponse.json({ data: records });
  } catch (err) {
    return NextResponse.json({ error: "ไม่มี" }, { status: 500 });
  }
}

// Create a new record
export async function POST(req: NextRequest) {
    const data = await req.json();
    const { amount, date, type, notes, userId } = data; // Remove recordId

    // Remove validation for required fields
    const newRecord = new Record({ amount, date, type, notes, userId }); // No recordId
    await newRecord.save();

    return NextResponse.json({ status: 200, message: "Record added" });
}

export async function DELETE(req: NextRequest) {
    console.log('Delete request received'); // Log the request initiation
    
    // Get the record ID directly from the request body
    const data = await req.json();
    const id: string | undefined = data.id; // Extract ID from the body

    console.log(`Record ID to delete: ${id}`); // Log the ID being passed

    try {
        await connectToDatabase(); // Ensure the database connection
        const result = await Record.findByIdAndDelete(id); // Attempt to delete the record

        if (!result) {
            console.error("Record not found"); // Log if the record was not found
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        console.log("Record deleted successfully"); // Log successful deletion
        return NextResponse.json({ message: "Record deleted" });
    } catch (err) {
        console.error("Error during deletion:", err); // Log the error for debugging
        return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
    }
}

// Update a record by ID
export async function PUT(req: NextRequest) {
    console.log('Edit request received'); // Log the request initiation
    
    const data = await req.json();
    const { id, amount, date, type, notes } = data; // Extract the fields to update

    try {
        await connectToDatabase(); // Ensure the database connection
        const updatedRecord = await Record.findByIdAndUpdate(id, { amount, date, type, notes }, { new: true }); // Update the record

        if (!updatedRecord) {
            console.error("Record not found"); // Log if the record was not found
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        console.log("Record updated successfully"); // Log successful update
        return NextResponse.json({ message: "Record updated", data: updatedRecord });
    } catch (err) {
        console.error("Error during update:", err); // Log the error for debugging
        return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
    }
}

