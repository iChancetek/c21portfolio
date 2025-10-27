# **App Name**: Chancellor Minus - AI Portfolio

## Core Features:

- Semantic Project Search: Enables users to search for projects using natural language queries, leveraging embeddings stored in PostgreSQL and managed via Firebase AI Studio, returning a ranked list of project IDs and match reasons.
- AI Portfolio Assistant: A chat interface providing answers to user questions about Chancellor's experience and skills using Retrieval-Augmented Generation (RAG) from a PostgreSQL knowledge base, driven by a Firebase AI Studio prompt.
- Dynamic Case Study Generator: Generates detailed technical deep-dives for each project on the fly. An LLM uses a tool and accesses data stored in the PostgreSQL database using a Firebase AI Studio prompt.
- Project Showcase: Displays projects in a dynamic grid with project logo/image, title, one-liner, tech stack icons, 'Generate Deep-Dive' button, and links to live demo & GitHub.
- Skills & Expertise Visualization: Presents an interactive visualization of Chancellor's tech stack, categorized into Frontend, Backend, AI/ML, and DevOps.
- Admin Panel: Content Management System powered by Clerk, enabling administrators to securely create and manage content in the database.
- Contact Form: Simple form for users to contact Chancellor. Utilizes a service such as Formspree or Resend.
- Full Stack Site: Create a full stack site with user authentication and voice options. Frontend should work with the backend, using Firebase, OpenAI models, and Whispers for an interactive AI user experience.

## Style Guidelines:

- Primary color: Saturated cyan (#00FFFF), echoing a high-tech, command-center aesthetic.
- Background color: Dark gray (#222222), providing contrast and a 'developer dashboard' feel.
- Accent color: Electric purple (#800080) to draw attention to interactive elements and highlights.
- Font: 'Inter' (sans-serif) for a clean, modern, readable interface.
- Use a set of consistent, line-based icons from Shadcn/ui to represent technologies and project categories.
- Implement a grid-based layout using Shadcn/ui components for a structured and responsive design.
- Employ subtle animations on hover using Framer Motion to enhance interactivity and provide feedback to the user.