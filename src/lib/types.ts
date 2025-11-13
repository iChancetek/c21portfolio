import type { LucideIcon, LucideProps } from "lucide-react";

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
  icon: LucideIcon | (({ className }: { className?: string }) => JSX.Element) | React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Venture {
    id: string;
    name: string;
    href: string;
    description: string;
}

export interface VentureIcon {
    name: string;
    icon: LucideIcon;
}

export interface PartnerCompany {
    name: string;
}
