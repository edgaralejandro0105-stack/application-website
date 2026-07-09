import React from 'react';
import { GlassNavbar } from '../components/GlassNavbar';
import { HeroSection } from '../sections/HeroSection';
import { AreasSection } from '../sections/AreasSection';
import { ProductsSection } from '../sections/ProductsSection';
import { ServicesSection } from '../sections/ServicesSection';
import { GallerySection } from '../sections/GallerySection';
import { PlannerSection } from '../sections/PlannerSection';
import { LocationSection } from '../sections/LocationSection';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';

export function LandingPage() {
  return (
    <>
      <GlassNavbar />
      <main className="flex-1">
        <HeroSection />
        <AreasSection />
        <ProductsSection />
        <ServicesSection />
        <GallerySection />
        <PlannerSection />
        <LocationSection />
      </main>
      <FloatingWhatsApp />
      <Footer />
    </>
  );
}
