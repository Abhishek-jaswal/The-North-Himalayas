
"use client";

import { useEffect } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "@/app/lib/firebase";
import { pb } from "@/app/lib/pocketbase";

export default function NotificationInit() {
  useEffect(() => {
    const init = async () => {
      if (!messaging) return;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const token = await getToken(messaging, {
        vapidKey: "BMXDAtFlUe9cPj7YeMVtgIWQvA2K7AQbMNyg42BYlCzho8M4GYo6owp2h77b67S5GZhXlfBxs1CyTrFdK0YNbkY",
      });

      console.log("🔥 FCM TOKEN:", token);
      if (!token) return;

      const salespersonId = pb.authStore.model?.id;
      if (!salespersonId) return;

      // 🔍 check existing token record
      const existing = await pb
        .collection("sales_push_tokens")
        .getFirstListItem(`salesperson="${salespersonId}"`)
        .catch(() => null);

      if (existing) {
        // 🔁 update
        await pb.collection("sales_push_tokens").update(existing.id, {
          token,
        });
      } else {
        // ➕ create
        await pb.collection("sales_push_tokens").create({
          salesperson: salespersonId,
          token,
        });
      }

      console.log("✅ Token saved in sales_push_tokens");
    };

    init();
  }, []);

  return null;
}
