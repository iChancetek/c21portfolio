import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
import ProjectShowcase from '@/components/ProjectShowcase';
import Skills from '@/components/Skills';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ProjectShowcase />
      <Skills />
      <Contact />
    </div>
  );
}
