// app/api/whatsapp/route.ts
import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090");

async function sendWhatsAppReply(to: string, text: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) {
    console.error("Missing WHATSAPP_TOKEN or WHATSAPP_PHONE_ID");
    return;
  }

  const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("WhatsApp send error:", data);
    } else {
      console.log("WhatsApp reply sent:", data);
    }
  } catch (err) {
    console.error("Error sending WhatsApp reply:", err);
  }
}

export async function POST(req: Request) {
  try {
    // === SECURITY: require your webhook secret header (prevents random posts) ===
    const headerSecret = req.headers.get("x-webhook-secret");
    if (headerSecret !== process.env.WHATSAPP_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // === ADMIN AUTH ON POCKETBASE ===
    const adminEmail = process.env.PB_ADMIN_EMAIL;
    const adminPassword = process.env.PB_ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      console.error("Missing PB admin env vars");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    await pb.admins.authWithPassword(adminEmail, adminPassword);
    console.log("PB admin logged in:", pb.authStore.isAdmin);

    // === parse payload ===
    const payload = await req.json();

    // Meta sends many kinds of events; find message if present
    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    const message = value?.messages?.[0];
    if (!message) {
      // no message event (could be status update, etc.) — accept silently
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // message.from is sender phone number (e.g., "9199....")
    const from = message.from;
    // For text message body:
    const textBody = message.text?.body || (message.type === "button" && message.button?.text) || "";
    // For contacts or templates, adjust parsing as needed

    // sanitize phone: sometimes includes country code already; we'll store as-is
    const phone = from;
    const name = (message.from && `WhatsApp:${from}`) || "Unknown";
    const messageText = textBody || "";

    // === fetch active salespersons ===
    const salespersons = await pb.collection("salespersons").getFullList({
      filter: "is_active = true",
      sort: "created",
    });

    if (!salespersons.length) {
      return NextResponse.json({ error: "No active salespersons" }, { status: 400 });
    }

    // === round robin via settings ===
    const settings = await pb.collection("settings").getFirstListItem("");
    const lastId = settings.last_salesperson_id || null;
    let nextIndex = 0;
    const lastIndex = salespersons.findIndex((s) => s.id === lastId);
    if (lastIndex !== -1) {
      nextIndex = (lastIndex + 1) % salespersons.length;
    }
    const assigned = salespersons[nextIndex];

    // === create lead (avoid duplicates if you want) ===
    await pb.collection("leads").create({
      name,
      phone,
      message: messageText,
      source: "whatsapp",
      assigned_to: assigned.id,
      status: "new",
    });

    // === update settings pointer ===
    await pb.collection("settings").update(settings.id, {
      last_salesperson_id: assigned.id,
    });

    // === send auto-reply to customer ===
    await sendWhatsAppReply(
      phone,
      "Thanks for contacting The North Himalayas! Our Team will contact you shortly."
    );

    return NextResponse.json({
      success: true,
      assigned_to: assigned.name,
      salesperson_id: assigned.id,
    });
  } catch (err: any) {
    console.error("WhatsApp webhook error:", err);
    return NextResponse.json({ error: "Internal server error", details: err.message || err }, { status: 500 });
  }
}
