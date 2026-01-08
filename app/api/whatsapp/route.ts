// app/api/whatsapp/route.ts
import { NextResponse } from "next/server";
import PocketBase, { type RecordModel } from "pocketbase";

const pb = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "https://api.thenorthhimalayas.com"
);

/* ======================
   TYPES
====================== */
interface WhatsAppMessage {
  from: string;
  type: string;
  text?: { body: string };
  button?: { text: string };
}

interface WebhookPayload {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: WhatsAppMessage[];
      };
    }>;
  }>;
}

/* ======================
   WHATSAPP SEND
====================== */
async function sendWhatsAppReply(to: string, text: string): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  if (!token || !phoneId) return;

  await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
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
}

/* ======================
   POST HANDLER
====================== */
export async function POST(req: Request) {
  try {
    /* === WEBHOOK SECURITY === */
    const headerSecret = req.headers.get("x-webhook-secret");
    if (headerSecret !== process.env.WHATSAPP_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* === POCKETBASE ADMIN AUTH === */
    const adminEmail = process.env.PB_ADMIN_EMAIL;
    const adminPassword = process.env.PB_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    await pb.admins.authWithPassword(adminEmail, adminPassword);

    /* === PARSE PAYLOAD SAFELY === */
    const payload = (await req.json()) as WebhookPayload;

    const message =
      payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return NextResponse.json({ success: true });
    }

    const phone = message.from;
    const messageText =
      message.text?.body ??
      (message.type === "button" ? message.button?.text : "") ??
      "";

    const name = `WhatsApp:${phone}`;

    /* === FETCH ACTIVE SALESPERSONS === */
    const salespersons = (await pb
      .collection("salespersons")
      .getFullList({
        filter: "is_active = true",
        sort: "created",
      })) as RecordModel[];

    if (salespersons.length === 0) {
      return NextResponse.json(
        { error: "No active salespersons" },
        { status: 400 }
      );
    }

    /* === ROUND ROBIN ASSIGNMENT === */
    const settings = await pb
      .collection("settings")
      .getFirstListItem("");

    const lastId = settings.last_salesperson_id as string | null;

    const lastIndex = salespersons.findIndex(
      (s) => s.id === lastId
    );

    const nextIndex =
      lastIndex === -1
        ? 0
        : (lastIndex + 1) % salespersons.length;

    const assigned = salespersons[nextIndex];

    /* === CREATE LEAD === */
    await pb.collection("leads").create({
      name,
      phone,
      message: messageText,
      source: "whatsapp",
      assigned_to: assigned.id,
      status: "new",
    });

    /* === UPDATE POINTER === */
    await pb.collection("settings").update(settings.id, {
      last_salesperson_id: assigned.id,
    });

    /* === AUTO REPLY === */
    await sendWhatsAppReply(
      phone,
      "Thanks for contacting The North Himalayas! Our Team will contact you shortly."
    );

    return NextResponse.json({
      success: true,
      salesperson_id: assigned.id,
      assigned_to: assigned.get("name"),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Internal server error", details: message },
      { status: 500 }
    );
  }
}
