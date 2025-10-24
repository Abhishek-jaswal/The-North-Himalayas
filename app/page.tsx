import Image from "next/image";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ContactForm from "./components/ContactForm";
import FullScreenCarousel from "./components/FullScreenCarousel";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="text-3xl font-bold  ">
      <Navbar />
      <FullScreenCarousel />
      <ContactForm />
      <WhatsAppButton />
     <Footer />

    </div>
  );
}
