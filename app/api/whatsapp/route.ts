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

    console.log("WHATSAPP WEBHOOK:", JSON.stringify(body, null, 2));

    const value = body.entry?.[0]?.changes?.[0]?.value;
    const messageObj = value?.messages?.[0];

    if (!messageObj || messageObj.type !== "text") {
      return NextResponse.json({ ok: true });
    }

    const phone = messageObj.from;
    const text = messageObj.text?.body ?? "";

    // ✅ WhatsApp profile name
    const contactName =
      value?.contacts?.[0]?.profile?.name || "WhatsApp Client";

    await ensurePBAuth();

    // 🔍 Check if lead exists
    let existingLead = null;

    try {
      existingLead = await pb
        .collection("leads")
        .getFirstListItem(`phone="${phone}"`);
    } catch {
      existingLead = null;
    }

    // 🟢 UPDATE lead → append message
    if (existingLead) {
      const updatedMessage = existingLead.message
        ? `${existingLead.message}\n${text}`
        : text;

      await pb.collection("leads").update(existingLead.id, {
        name: existingLead.name || contactName,
        message: updatedMessage,
      });
    }

    // 🔵 CREATE new lead
    else {
      await pb.collection("leads").create({
        name: contactName,
        phone,
        message: text,
        source: "whatsapp",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
