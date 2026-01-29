importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");


firebase.initializeApp({
  apiKey: "AIzaSyAYBg_ruUFiSEQsWf8R5AY7gZqMwjygd_c",
  authDomain: "north-himalayas-pwa.firebaseapp.com",
  projectId: "north-himalayas-pwa",
  messagingSenderId: "904422215005",
  appId: "1:904422215005:web:a52b6b19be6b5c672dacb4"
});


const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon-192.png",
  });
});
