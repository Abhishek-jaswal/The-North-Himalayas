import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ContactForm from "./components/ContactForm";
import FullScreenCarousel from "./components/FullScreenCarousel";
import Navbar from "./components/Navbar";
import PlanYourTrip from "./components/PlanYourTrip";
import ImageMarquee from "./components/ImageMarquee";


export default function Home() {
  return (
    <div className="text-3xl font-bold  ">
      <Navbar />
      <FullScreenCarousel />
      <PlanYourTrip />
      <ImageMarquee />
      <ContactForm />
      <WhatsAppButton />
     <Footer />

    </div>
  );
}
