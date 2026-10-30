import { useEffect, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { MusicProvider } from "./context/MusicContext";
import { ContactModalProvider } from "./context/ContactModalContext";
import { AssistantProvider } from "./context/AssistantContext";
import Loader from "./components/Loader";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import BackgroundFX from "./components/BackgroundFX";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Philosophy from "./components/Philosophy";
import Music from "./components/Music";
import Experience from "./components/Experience";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import MiniPlayer from "./components/MiniPlayer";
import Dock from "./components/Dock";

function Site() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1650);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip text-white/80">
      <Loader visible={loading} />
      <CustomCursor />
      <ScrollProgress />
      <BackgroundFX />
      <Navbar />

      <main>
        <Hero />
        <Marquee items={["Graphic Design", "Brand Identity", "Social Media", "Poster Art", "Learning Front-end"]} />
        <About />
        <Services />
        <Projects />
        <Skills />
        <Philosophy />
        <Music />
        <Experience />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
      <MiniPlayer />
      <Dock />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MusicProvider>
        <ContactModalProvider>
          <AssistantProvider>
            <Site />
          </AssistantProvider>
        </ContactModalProvider>
      </MusicProvider>
    </ThemeProvider>
  );
}
