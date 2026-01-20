import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL!);

/* =========================
   GET → META VERIFICATION
========================= */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Facebook verification
  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

/* =========================
   POST → RECEIVE MESSAGE
========================= */
export async function POST(req: NextRequest) {
  try {
    // Authenticate PocketBase admin (server-side)
    await pb.admins.authWithPassword(
      process.env.PB_ADMIN_EMAIL!,
      process.env.PB_ADMIN_PASSWORD!
    );

    const body = await req.json();

    // Get the first message from the webhook payload
    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message) {
      return NextResponse.json({ ok: true }); // no message → ignore
    }

    const phone = message.from;
    const text = message.text?.body || "No text";

    // Save the lead in PocketBase
    await pb.collection("leads").create({
      name: `WhatsApp ${phone}`,
      phone,
      message: text,
      source: "whatsapp",
      status: "new",
    });

    // Auto-reply to the user
    const whatsappUrl = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
    await fetch(whatsappUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_LONG_LIVED_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: {
          body:
            "Thanks for contacting The North Himalayas! Our team will reach you shortly.",
        },
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err: Error | unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Webhook error:", errorMessage);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
