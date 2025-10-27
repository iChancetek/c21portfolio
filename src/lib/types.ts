import type { LucideIcon } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  oneLiner: string;
  image: {
    src: string;
    alt: string;
    hint: string;
  };
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
}

export interface Skill {
  name: string;
  icon: LucideIcon | (({ className }: { className?: string }) => JSX.Element);
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}
