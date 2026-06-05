import React from 'react';
import { GlassNavbar } from './components/GlassNavbar';
import { HeroSection } from './sections/HeroSection';
import { AreasSection } from './sections/AreasSection';
import { ProductsSection } from './sections/ProductsSection';
import { ServicesSection } from './sections/ServicesSection';
import { GallerySection } from './sections/GallerySection';
import { PlannerSection } from './sections/PlannerSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import './index.css';

function App() {
  return (
    <div className="bg-background min-h-screen text-on-background selection:bg-primary/30 selection:text-primary flex flex-col">
      <GlassNavbar />
      <main className="flex-1">
        <HeroSection />
        <AreasSection />
        <ProductsSection />
        <ServicesSection />
        <GallerySection />
        <PlannerSection />
      </main>
      
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}

export default App;
