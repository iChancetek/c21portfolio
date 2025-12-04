
import type { LucideIcon, LucideProps } from "lucide-react";
import { z } from 'zod';

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
    hasDemo: boolean;
}

export interface VentureIcon {
    name: string;
    icon: LucideIcon;
}

export interface PartnerCompany {
    name: string;
    description?: string;
}

export const UserAffirmationInteractionSchema = z.object({
  userId: z.string().describe("The user's unique ID."),
  affirmation: z.string().describe('The content of the affirmation.'),
  interaction: z.enum(['liked', 'disliked', 'favorite']).describe('The type of interaction.'),
  timestamp: z.string().describe('The server timestamp of the interaction.'),
});
export type UserAffirmationInteraction = z.infer<typeof UserAffirmationInteractionSchema>;

export interface ResumeData {
  name: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  coreCompetencies: string[];
  technicalExpertise: {
    title: string;
    skills: string;
  }[];
  experience: {
    title: string;
    company: string;
    date: string;
    location: string;
    description: string;
    highlights: string[];
  }[];
  education: {
    course: string;
    institution: string;
  }[];
  portfolioLink: string;
}
    

