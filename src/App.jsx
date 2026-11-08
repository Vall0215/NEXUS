import { useEffect } from "react";
import SectionRail from "./components/SectionRail";
import Header from "./components/Header";
import Hero from "./components/Hero";
import EnergyMap from "./components/EnergyMap";
import Simulator from "./components/Simulator";
import Copilot from "./components/Copilot";
import Pricing from "./components/Pricing";
import CheckoutModal from "./components/CheckoutModal";
import Footer from "./components/Footer";
export default function App() {
  useEffect(() => {
    import("../scene3d.js?v=react-components-1").catch((error) => {
      console.error("NEXUS: no se pudo iniciar la escena 3D.", error);
    });
  }, []);
  return (
    <>
      <SectionRail />
      <Header />
      <main>
        <Hero />
        <EnergyMap />
        <Simulator />
        <Copilot />
        <Pricing />
      </main>
      <CheckoutModal />
      <Footer />
    </>
  );
}