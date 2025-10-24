import Image from "next/image";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ContactForm from "./components/ContactForm";

export default function Home() {
  return (
    <div className="text-3xl font-bold  ">
      <ContactForm />
      <WhatsAppButton />
     <Footer />

    </div>
  );
}
