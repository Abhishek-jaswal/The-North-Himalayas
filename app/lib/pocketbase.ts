import PocketBase from "pocketbase";

export const pb = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090"
);

// 🔴 THIS LINE FIXES AbortError IN NEXT.JS
pb.autoCancellation(false);

// Browser auth persistence (SAFE)
if (typeof window !== "undefined") {
  pb.authStore.loadFromCookie(document.cookie);

  pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie({
      httpOnly: false,
      sameSite: "Lax",
      secure: false, // set true on https
      path: "/",
    });
  });
}
