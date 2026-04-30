import { resumeData } from '@/lib/data';
import { Mail, Phone, MapPin, Github, Link as LinkIcon } from 'lucide-react';

export default function PrintResume() {
  return (
    <div className="hidden print:block w-full text-black bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="grid grid-cols-[1fr_2.5fr] min-h-screen">
        {/* LEFT COLUMN - ACCENT BACKGROUND */}
        <div className="bg-slate-50 p-8 border-r border-slate-200">
          {/* Contact Section */}
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-300 pb-1">Contact</h2>
            <div className="space-y-3 text-[10px] text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                <span>{resumeData.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>{resumeData.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{resumeData.contact.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5" />
                <span>{resumeData.contact.portfolio.replace('https://', '')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Github className="w-3.5 h-3.5" />
                <span>{resumeData.contact.github.replace('https://', '')}</span>
              </div>
            </div>
          </div>

          {/* Core Competencies */}
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-300 pb-1">Core Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {resumeData.coreCompetencies.map((skill) => (
                <span key={skill} className="text-[9px] bg-slate-200 text-slate-800 px-2 py-1 rounded-md font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Technical Expertise */}
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-300 pb-1">Technical Stack</h2>
            <div className="space-y-4">
              {resumeData.technicalExpertise.map((cat) => (
                <div key={cat.title}>
                  <h3 className="text-[10px] font-bold text-slate-800 mb-1">{cat.title}</h3>
                  <p className="text-[9px] text-slate-600 leading-tight">
                    {cat.skills.replace(/\\n/g, ' • ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-300 pb-1">Education</h2>
            <div className="space-y-3">
              {resumeData.education.slice(0, 4).map((edu) => (
                <div key={edu.course}>
                  <p className="text-[10px] font-bold text-slate-800 leading-tight">{edu.course}</p>
                  <p className="text-[9px] text-slate-600 leading-tight mt-0.5">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - MAIN CONTENT */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">{resumeData.name}</h1>
            <p className="text-lg text-blue-600 font-semibold uppercase tracking-widest">AI Engineer & Cloud Architect</p>
          </div>

          {/* Professional Summary */}
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">1</span>
              Professional Summary
            </h2>
            <p className="text-[10px] text-slate-700 leading-relaxed whitespace-pre-wrap">
              {resumeData.summary}
            </p>
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-200 pb-1 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">2</span>
              Professional Experience
            </h2>
            <div className="space-y-6">
              {resumeData.experience.map((job) => (
                <div key={job.company + job.title} style={{ pageBreakInside: 'auto' }}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                    <span className="text-[10px] text-slate-500 font-mono font-semibold bg-slate-100 px-2 py-0.5 rounded">{job.date}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-2">
                    <p className="text-[11px] font-bold text-blue-600">{job.company}</p>
                    <span className="text-[9px] text-slate-500">{job.location}</span>
                  </div>
                  {job.description && (
                    <p className="text-[10px] text-slate-700 mb-2 leading-relaxed italic">{job.description}</p>
                  )}
                  {job.highlights && job.highlights.length > 0 && (
                    <ul className="space-y-1 mt-1 pl-3">
                      {job.highlights.map((highlight, i) => (
                        <li key={i} className="text-[9.5px] text-slate-700 leading-snug relative">
                          <span className="absolute -left-3 top-[3px] w-1 h-1 bg-blue-400 rounded-full"></span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
