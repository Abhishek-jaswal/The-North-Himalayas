self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};

  self.registration.showNotification(data.title || "New Lead Assigned", {
    body: data.body || "A new lead has been assigned to you",
    icon: "/pro/sales/icon-192.png",
    badge: "/pro/sales/icon-192.png",
    data
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/pro/sales/dashboard")
  );
});
