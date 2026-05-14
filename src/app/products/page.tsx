
'use client';

import Contact from '@/components/Contact';
import Skills from '@/components/Skills';
import FloatingAIAssistant from '@/components/FloatingAIAssistant';
import ProductShowcase from '@/components/ProductShowcase';
import { allVentures } from '@/lib/data';

export default function ProductsPage() {
  return (
    <div className="flex flex-col">
      <ProductShowcase products={allVentures} />
      <Skills />
      <Contact />
      <FloatingAIAssistant />
    </div>
  );
}
