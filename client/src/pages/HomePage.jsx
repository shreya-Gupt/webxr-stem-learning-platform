import React from 'react';
import Hero from '../components/home/Hero';
import ProblemSection from '../components/home/ProblemSection';
import FeaturesSection from '../components/home/FeaturesSection';
import ConceptsSection from '../components/home/ConceptsSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import CtaSection from '../components/home/CtaSection';

export default function HomePage() {
  return (
    <main className="w-full flex flex-col bg-cyber-grid">
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <ConceptsSection />
      <HowItWorksSection />
      <CtaSection />
    </main>
  );
}
