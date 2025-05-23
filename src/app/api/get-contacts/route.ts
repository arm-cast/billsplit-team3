import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server"; // Import Clerk's currentUser function
import mongoose from "mongoose";
import Contact from "@/lib/models/contact.model"; // Import the contact model
import { connectToDB } from "@/lib/mongoose";



export async function GET(req: Request) {
  try {
    await connectToDB();
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch and convert Mongoose documents to plain JS objects
    const contacts = await Contact.find({ clerkId: clerkUser.id });
    const plainContacts = contacts.map(contact => contact.toObject());

    return NextResponse.json({ success: true, contacts: plainContacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch contacts." }, { status: 500 });
  }
}
