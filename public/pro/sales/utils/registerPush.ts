import { pb } from "@/app/lib/pocketbase";

export async function registerPushToken() {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY
  });

  const token = JSON.stringify(subscription);
  const userId = pb.authStore.model?.id;

  if (!userId) return;

  // check existing token
  const existing = await pb.collection("sales_push_tokens").getFullList({
    filter: `salesperson="${userId}"`
  });

  const alreadySaved = existing.find(e => e.token === token);
  if (alreadySaved) return;

  await pb.collection("sales_push_tokens").create({
    salesperson: userId,
    token,
    device: navigator.userAgent
  });
}
