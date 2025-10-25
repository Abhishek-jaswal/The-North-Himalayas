import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import FullScreenCarousel from "./components/FullScreenCarousel";
import Navbar from "./components/Navbar";
import PlanYourTrip from "./components/PlanYourTrip";
import ImageMarquee from "./components/ImageMarquee";
import Trial from "./components/trial";


export default function Home() {
  return (
    <div className="text-3xl font-bold  ">
    
      <Navbar />
      <FullScreenCarousel />
        <Trial />
      {/* <ContactForm /> */}
      <PlanYourTrip />
      <ImageMarquee />
      <WhatsAppButton />
     <Footer />

    </div>
  );
}
