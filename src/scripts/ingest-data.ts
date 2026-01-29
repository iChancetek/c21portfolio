
import 'dotenv/config'; // Ensure env vars are loaded
import { projects, allVentures, resumeData, skillCategories } from '@/lib/data';
import { upsertVector } from '@/lib/rag';
import { chunkText } from '@/lib/chunking';

async function ingestData() {
    console.log('Starting ingestion...');

    try {
        // 1. Ingest Projects
        console.log('Ingesting Projects...');
        for (const project of projects) {
            const text = `Project: ${project.title}\nDescription: ${project.oneLiner}\nTech Stack: ${project.techStack.join(', ')}`;
            await upsertVector(`project-${project.id}`, text, {
                type: 'project',
                source: 'projects',
                title: project.title,
            });
        }

        // 2. Ingest Ventures
        console.log('Ingesting Ventures...');
        for (const venture of allVentures) {
            const text = `Venture: ${venture.name}\nDescription: ${venture.description}`;
            await upsertVector(`venture-${venture.id}`, text, {
                type: 'venture',
                source: 'allVentures',
                title: venture.name,
            });
        }

        // 3. Ingest Resume Data (Summary & Experience)
        console.log('Ingesting Resume...');

        // Summary
        await upsertVector('resume-summary', `Chancellor Minus Summary: ${resumeData.summary}`, {
            type: 'resume',
            section: 'summary'
        });

        // Experience
        for (const exp of resumeData.experience) {
            const text = `Role: ${exp.title} at ${exp.company}\nDate: ${exp.date}\nLocation: ${exp.location}\nDescription: ${exp.description}\nHighlights: ${exp.highlights.join('\n- ')}`;

            // Chunk long experience entries if needed, but for now we'll store as one block as they're not massive
            // If they are huge, we would use chunkText(text)
            await upsertVector(`exp-${exp.company.replace(/\s+/g, '-').toLowerCase()}`, text, {
                type: 'resume',
                section: 'experience',
                company: exp.company
            });
        }

        // Skills
        console.log('Ingesting Skills...');
        for (const category of skillCategories) {
            const skillsList = category.skills.map(s => s.name).join(', ');
            const text = `Skills in ${category.title}: ${skillsList}`;
            await upsertVector(`skills-${category.title.replace(/\s+/g, '-').toLowerCase()}`, text, {
                type: 'resume',
                section: 'skills',
                category: category.title
            });
        }

        // Technical Expertise from Resume
        for (const expertise of resumeData.technicalExpertise) {
            const text = `Technical Expertise - ${expertise.title}: ${expertise.skills}`;
            await upsertVector(`tech-expert-${expertise.title.replace(/\s+/g, '-').toLowerCase()}`, text, {
                type: 'resume',
                section: 'technicalExpertise',
                category: expertise.title
            });
        }

        console.log('Ingestion complete!');
    } catch (error) {
        console.error('Error during ingestion:', error);
    }
}

// Check if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    ingestData();
}

export { ingestData };
