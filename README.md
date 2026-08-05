# Chancellor Minus — Enterprise Agentic AI Platform & Portfolio (`c21portfolio`)

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-1.4.9-blue?style=for-the-badge)](https://js.langchain.com/docs/langgraph)
[![OpenAI](https://img.shields.io/badge/OpenAI-SDK_6.16-412991?style=for-the-badge&logo=openai)](https://platform.openai.com/)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-000000?style=for-the-badge)](https://www.pinecone.io/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

An enterprise-grade, 21st-century portfolio platform built by **Chancellor Minus**, founder of **[iChanceTEK](https://ichancetek.com)** and **[iSynera](https://isynera.us)**. 

The platform features an autonomous **Supervisor Agent (iSynera)** coordinating **9 specialized AI agents and flows** using stateful directed execution graphs (LangGraph JS & OpenAI Agents SDK), dense vector search (Pinecone RAG), persistent long-term thread memory (Google Cloud Firestore), and real-time voice perception/synthesis.

---

## 🏛️ Executive Architecture Overview

```
                          USER QUERY / VOICE INPUT
                                     │
                                     ▼
                   ┌──────────────────────────────────┐
                   │   Supervisor Agent (iSynera)     │
                   │   StateGraph (LangGraph JS)      │
                   └─────────────────┬────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  Pinecone RAG    │       │ Firestore Memory │       │  Voice AI Engine │
│ 512d Vector DB   │       │ Long-Term Threads│       │ Whisper & OpenAI │
└────────┬─────────┘       └────────┬─────────┘       └────────┬─────────┘
         │                           │                           │
         └───────────────────────────┼───────────────────────────┘
                                     │
                                     ▼
                   ┌──────────────────────────────────┐
                   │  9 Specialized AI Agentic Flows  │
                   │  Executing & Consensus Verification │
                   └─────────────────┬────────────────┘
                                     │
                                     ▼
                        GROUNDED RESPONSE / VOICE TTS
```

---

## 🤖 The Supervisor Agent & 9 Specialized AI Agents

### 1. **Supervisor Agent (`iSynera`)** — `ai-portfolio-assistant.ts`
- **Role**: Central Orchestrator & Supervisor built on **LangGraph (`StateGraph`)**.
- **Capabilities**: Receives multi-modal user queries, routes execution to specialized tool nodes (`search_portfolio`, `search_user_threads`), maintains conversation state in `MessagesAnnotation`, and injects factual RAG context into natural responses.

### 2. **iChancellor Wellness Agent** — `ichancellor-flow.ts`
- **Role**: Mindfulness & Guided Audio Meditation Agent providing stress reduction strategies and wellness guidance.

### 3. **iSkylar Voice Therapy Agent** — `iskylar-search-flow.ts`
- **Role**: Therapeutic Voice & Empathy Search Agent providing compassionate, active-listening dialogue and support.

### 4. **Dynamic Case Study Generator Agent** — `dynamic-case-study-generator.ts`
- **Role**: Synthesizes real-time architectural deep-dives, technical challenges, and solution blueprints for any platform venture.

### 5. **Tech Expert Analyst Agent** — `tech-expert-flow.ts`
- **Role**: Produces executive-level technical analysis across GenAI, MLOps, DevOps, cloud architecture, and data engineering.

### 6. **Daily Affirmation Generator Agent** — `affirmation-generator.ts`
- **Role**: Generates personalized, empowering daily positive mindset statements based on user goals.

### 7. **Whisper STT Perception Agent** — `whisper-flow.ts`
- **Role**: High-accuracy Speech-to-Text transcription powered by OpenAI Whisper (`whisper-1`).

### 8. **OpenAI Voice Synthesis TTS Agent** — `openai-tts-flow.ts`
- **Role**: Multi-lingual neural audio playback supporting 20+ languages (`tts-1`, `alloy`/`echo`/`fable`/`onyx`/`nova`/`shimmer`).

### 9. **Healthy Living Planner Agent** — `menuSuggestionFlow.ts`
- **Role**: Personalized nutrition planning, wellness routines, and meal suggestion agent.

---

## 🧠 Key Platform Capabilities

### 1. Dense Vector Retrieval-Augmented Generation (RAG)
- **Vector Index**: Pinecone `c21portfolio` index storing 512-dimensional dense vector embeddings generated via `text-embedding-3-small`.
- **Ingestion Pipeline**: Ingests complete venture documentation, architectural specs, resume history, and company entities (`iChanceTEK`, `iSynera`, `Chancellor OS`, `iCareOS`, etc.).
- **Zero-Hallucination**: Queries the vector store autonomously during tool execution, ensuring responses are strictly grounded in factual platform data.

### 2. Persistent Long-Term Thread Memory
- **Firestore Integration**: Connected to Google Cloud Firestore collection `social_engagements`.
- **Thread Recall**: The Supervisor Agent uses the `search_user_threads` tool to read, recall, and reference visitor comments, discussion threads, and feedback across sessions.

### 3. Agentic Coding & Workflow Orchestration
- Standardized Model Context Protocol (MCP) tool-calling patterns.
- Replaced legacy paradigms with **Agentic Coding** across all venture platforms and system prompts.

---

## 🚀 Venture & Platform Ecosystem

| Platform | Domain | Description |
| :--- | :--- | :--- |
| **iChanceTEK** | Enterprise AI | Parent technology innovation studio and enterprise AI partner. |
| **iSynera** | Agentic AI Consultancy | Enterprise Agentic AI architecture platform and AI portfolio assistant. |
| **Chancellor** | Work OS (ERP / CRM) | All-in-one enterprise operating system unifying operations and workflows. |
| **iCareOS & iCareOS Premium** | Healthcare AI | Clinical operating system for automated documentation, medical image analysis, and billing. |
| **StrideIQ** | Fitness & Wellness | All-in-one tracking for running, walking, biking, hiking, meditation, and fasting. |
| **Famio** | AI Social Network | Next-generation social platform for meaningful connections and discovery. |
| **Evolvable** | Agentic Coding | Prompt-to-production agentic software development platform. |
| **WorkSpaceIQ** | AI Dictation & Research | AI research partner converting documents into interactive podcasts and insights. |

---

## 💻 Tech Stack & Dependencies

- **Framework**: [Next.js 16 (Turbopack, App Router, React 19)](https://nextjs.org/)
- **Agent Orchestration**: [@langchain/langgraph](https://js.langchain.com/docs/langgraph), [@langchain/openai](https://js.langchain.com/docs/integrations/chat/openai), [OpenAI SDK](https://platform.openai.com/docs/sdks), Zod
- **Vector Database**: [@pinecone-database/pinecone](https://www.pinecone.io/)
- **Persistent Storage**: [Google Cloud Firestore (Firebase Admin SDK)](https://firebase.google.com/)
- **Voice AI**: OpenAI Whisper STT (`whisper-1`) + OpenAI TTS (`tts-1`)
- **Styling & UI**: Vanilla CSS, TailwindCSS, Framer Motion, Radix UI Primitives, Lucide Icons, Three.js, React Three Fiber, Spline 3D

---

## 🛠️ Local Development & Setup

### 1. Prerequisites
- Node.js `^18.17.0` or `>=20.0.0`
- `npm` or `yarn`

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=c21portfolio

# Firebase / Firestore Credentials
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"
```

### 3. Running the Server

```bash
# Install dependencies
npm install

# Start local development server (Turbopack)
npm run dev

# Run Typecheck & Verification
npm run typecheck

# Build for Production
npm run build
```

---

## 📜 License & Copyright

© 2026 **Chancellor Minus** / **iChanceTEK**. All Rights Reserved.
