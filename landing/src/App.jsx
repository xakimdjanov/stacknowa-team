import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import ProductShowcase from './components/ProductShowcase';
import UserExperiences from './components/UserExperiences';
import Pricing from './components/Pricing';
import Faq from './components/Faq';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import DemoModal from './components/DemoModal';

function AppContent() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleOpenDemo = () => setIsDemoModalOpen(true);
  const handleCloseDemo = () => setIsDemoModalOpen(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', color: '#0F172A' }}>
      {/* Sticky Top Navbar */}
      <Navbar onOpenDemo={handleOpenDemo} />

      {/* SECTION 01 — HERO */}
      <Hero onOpenDemo={handleOpenDemo} />

      {/* SECTION 02 — PROBLEM */}
      <Problem />

      {/* SECTION 03 — SOLUTION */}
      <Solution />

      {/* SECTION 04 — FEATURES */}
      <Features />

      {/* SECTION 05 — HOW IT WORKS */}
      <HowItWorks onOpenDemo={handleOpenDemo} />

      {/* SECTION 06 — PRODUCT SHOWCASE */}
      <ProductShowcase onOpenDemo={handleOpenDemo} />

      {/* SECTION 07 — THREE USER EXPERIENCES */}
      <UserExperiences onOpenDemo={handleOpenDemo} />

      {/* SECTION 08 — PRICING / BUSINESS */}
      <Pricing onOpenDemo={handleOpenDemo} />

      {/* SECTION 09 — FAQ / TRUST */}
      <Faq />

      {/* SECTION 10 — FINAL CTA */}
      <FinalCta onOpenDemo={handleOpenDemo} />

      {/* FOOTER */}
      <Footer onOpenDemo={handleOpenDemo} />

      {/* ENTERPRISE DEMO REQUEST MODAL */}
      <DemoModal isOpen={isDemoModalOpen} onClose={handleCloseDemo} />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
