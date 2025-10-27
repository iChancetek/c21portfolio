import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
import ProjectShowcase from '@/components/ProjectShowcase';
import Skills from '@/components/Skills';
import Ventures from '@/components/Ventures';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ProjectShowcase />
      <Skills />
      <Ventures />
      <Contact />
    </div>
  );
}
