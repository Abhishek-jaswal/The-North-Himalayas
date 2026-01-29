import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAYBg_ruUFiSEQsWf8R5AY7gZqMwjygd_c",
  authDomain: "north-himalayas-pwa.firebaseapp.com",
  projectId: "north-himalayas-pwa",
  storageBucket: "north-himalayas-pwa.firebasestorage.app",
  messagingSenderId: "904422215005",
  appId: "1:904422215005:web:a52b6b19be6b5c672dacb4"
};
const app = initializeApp(firebaseConfig);

export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;
// "BMXDAtFlUe9cPj7YeMVtgIWQvA2K7AQbMNyg42BYlCzho8M4GYo6owp2h77b67S5GZhXlfBxs1CyTrFdK0YNbkY"