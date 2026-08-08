'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rss, ExternalLink, Headphones, Calendar, ArrowRight, Sparkles, BookOpen, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { fetchSubstackPosts, SubstackPost, FALLBACK_POSTS } from '@/lib/substack';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export default function SubstackFeed() {
  const [posts, setPosts] = useState<SubstackPost[]>(FALLBACK_POSTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadFeed() {
      try {
        const feedPosts = await fetchSubstackPosts();
        if (isMounted && feedPosts && feedPosts.length > 0) {
          setPosts(feedPosts);
        }
      } catch (err) {
        console.error('Failed to load Substack posts:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadFeed();
    return () => { isMounted = false; };
  }, []);

  const displayPosts = posts.slice(0, 6);

  return (
    <section id="substack-feed" className="relative w-full xl:w-[120%] 2xl:w-[140%] max-w-[1400px] mx-auto px-4 py-20 pointer-events-auto">
      {/* Background glow highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md shadow-[0_0_20px_rgba(var(--primary),0.2)]">
          <Rss className="w-4 h-4 text-primary animate-pulse" />
          <span>Substack RSS Feed</span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-primary-gradient max-w-4xl leading-tight">
          Explore Chancellor’s Latest Substack Articles & Insights on Technology, AI, Health & Wellness...
        </h2>

        <p className="max-w-2xl text-muted-foreground text-base sm:text-lg">
          Deep dives into Forward Deployed Engineering, Enterprise Agentic AI, Cloud Architecture, and Holistic Living.
        </p>

        <div className="pt-2">
          <Button asChild size="lg" className="bg-primary-gradient font-semibold shadow-[0_0_25px_rgba(var(--primary),0.3)] hover:shadow-[0_0_35px_rgba(var(--primary),0.5)] transition-all rounded-xl h-12 px-6">
            <a href="https://ichancellor.substack.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              <span>Subscribe on Substack</span>
              <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
            </a>
          </Button>
        </div>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayPosts.map((post, index) => (
          <motion.div
            key={post.link || index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col h-full"
          >
            <Card className="relative flex flex-col h-full overflow-hidden bg-background/50 border-border/60 hover:border-primary/50 transition-all duration-500 group rounded-2xl shadow-lg hover:shadow-[0_0_35px_-10px_rgba(var(--primary),0.25)] backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <CardHeader className="relative z-10 p-6 pb-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/60 px-3 py-1 rounded-full border border-border/40">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{formatDate(post.pubDate)}</span>
                  </div>

                  {post.audioUrl && (
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/30 shadow-[0_0_10px_rgba(var(--accent),0.2)]">
                      <Headphones className="w-3.5 h-3.5 animate-bounce" />
                      <span>Audio Available</span>
                    </div>
                  )}
                </div>

                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-snug">
                  <a href={post.link} target="_blank" rel="noopener noreferrer">
                    {post.title}
                  </a>
                </CardTitle>

                {post.description && (
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-3">
                    {post.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardFooter className="p-6 pt-2 mt-auto relative z-10">
                <Button asChild variant="outline" className="w-full justify-between border-primary/20 hover:border-primary/50 hover:bg-primary/10 rounded-xl h-11 text-sm font-semibold group/btn transition-all duration-300">
                  <a href={post.link} target="_blank" rel="noopener noreferrer">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      Read on Substack
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 text-primary" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Bottom Call to Action Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-14"
      >
        <Card className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-background/80 to-accent/10 border-primary/30 backdrop-blur-2xl p-8 rounded-2xl shadow-[0_0_40px_-15px_rgba(var(--primary),0.3)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-primary/15 rounded-2xl border border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Never miss an issue</h3>
                <p className="text-sm text-muted-foreground">
                  Get high-impact technology analysis, AI architecture frameworks, and wellness strategy delivered straight to your inbox.
                </p>
              </div>
            </div>

            <Button asChild size="lg" className="bg-primary-gradient font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all rounded-xl whitespace-nowrap px-8 h-12">
              <a href="https://ichancellor.substack.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <span>Join Substack Readers</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
