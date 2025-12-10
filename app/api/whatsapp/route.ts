import { NextResponse } from "next/server";
import { pb } from "@/app/lib/pocketbase";

// STEP 1: VERIFY TOKEN
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === "mycrm123") {
    return new Response(challenge);
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

// STEP 2: HANDLE INCOMING MESSAGES
export async function POST(req: Request) {
  const body = await req.json();

  try {
    const entry = body.entry?.[0]?.changes?.[0]?.value;
    const messageObj = entry?.messages?.[0];

    if (!messageObj) {
      return NextResponse.json({ ok: true, message: "No messages" });
    }

    const phone = messageObj.from;
    const text = messageObj.text?.body || "No message";

    // Save to PocketBase
    await pb.collection("leads").create({
      name: "WhatsApp Lead",
      phone,
      message: text,
      source: "whatsapp",
      status: "new",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
