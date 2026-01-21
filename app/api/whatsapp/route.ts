
import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL!);

let pbAuthed = false;

// Authenticate PocketBase ONCE
async function ensurePBAuth() {
  if (!pbAuthed) {
    await pb.admins.authWithPassword(
      process.env.PB_ADMIN_EMAIL!,
      process.env.PB_ADMIN_PASSWORD!
    );
    pbAuthed = true;
  }
}

/* =========================
   GET → META VERIFICATION
========================= */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

/* =========================
   POST → RECEIVE CLIENT MSG
========================= */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 🔥 DEBUG (remove later if you want)
    console.log("WHATSAPP WEBHOOK:", JSON.stringify(body, null, 2));

    const message =
      body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    // Ignore non-message events (statuses, etc.)
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    // Only text messages
    if (message.type !== "text") {
      return NextResponse.json({ ok: true });
    }

    const phone = message.from;
    const text = message.text?.body ?? "";

    // Authenticate PB once
    await ensurePBAuth();

    // Save ONLY incoming client message
 // Authenticate PB once
await ensurePBAuth();

// 🔍 Check if lead already exists by phone
let existingLead = null;

try {
  existingLead = await pb
    .collection("leads")
    .getFirstListItem(`phone="${phone}"`);
} catch (err) {
  existingLead = null;
}

// 🟢 If lead exists → UPDATE
if (existingLead) {
  const oldMessages = existingLead.messages || [];

  await pb.collection("leads").update(existingLead.id, {
    messages: [
      ...oldMessages,
      {
        text,
        time: new Date().toISOString(),
      },
    ],
    last_message: text,
    last_message_at: new Date().toISOString(),
  });
}
// 🔵 If lead does not exist → CREATE
else {
  await pb.collection("leads").create({
    name:text,
    phone,
    source: "whatsapp",
    status: "new",
    messages: [
      {
        text,
        time: new Date().toISOString(),
      },
    ],
    last_message: text,
    last_message_at: new Date().toISOString(),
  });
}


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
