export interface SubstackPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  audioUrl?: string;
}

export const FALLBACK_POSTS: SubstackPost[] = [
  {
    title: "The Rise of the Forward Deployed Engineer",
    link: "https://ichancellor.substack.com/p/the-rise-of-the-forward-deployed",
    pubDate: "Fri, 07 Aug 2026 22:02:36 GMT",
    description: "Inside the World's Most Important New Role in Artificial Intelligence: How a new generation of engineers is embedding itself inside complex organizations to build intelligent AI-native platforms.",
    audioUrl: "https://api.substack.com/feed/podcast/210277444/3055c966ad63d3ec74f4c1b8cef6bfa7.mp3",
  },
  {
    title: "Enterprise Agentic AI Engineering - Part 3B",
    link: "https://ichancellor.substack.com/p/enterprise-agentic-ai-engineering-726",
    pubDate: "Mon, 03 Aug 2026 17:52:43 GMT",
    description: "Building AI Systems Organizations Can Trust: From Resilience and Zero Trust to Enterprise AI Security Engineering, Circuit Breakers, and Disaster Recovery.",
    audioUrl: "https://api.substack.com/feed/podcast/209666556/36fb206108f1299ef79a330c60f7a0f8.mp3",
  },
  {
    title: "Enterprise Agentic AI Engineering - 3A",
    link: "https://ichancellor.substack.com/p/enterprise-agentic-ai-engineering-aa7",
    pubDate: "Thu, 30 Jul 2026 20:05:15 GMT",
    description: "Building AI Systems Organizations Can Trust: Enterprise Governance, Human Oversight, Prompt Injection Defenses, and AI Operations.",
    audioUrl: "https://api.substack.com/feed/podcast/209164195/42213d035deb4f59de17f3e1f3dc0abf.mp3",
  },
  {
    title: "Enterprise Agentic AI Engineering - Part 2",
    link: "https://ichancellor.substack.com/p/enterprise-agentic-ai-engineering-814",
    pubDate: "Thu, 30 Jul 2026 01:06:14 GMT",
    description: "Threat Modeling, Guardrails, and Secure Agent Architecture: Designing autonomous multi-agent platforms with least-privilege security.",
    audioUrl: "https://api.substack.com/feed/podcast/209054432/60ee66e583293095effd555f87abbaf7.mp3",
  }
];

export async function fetchSubstackPosts(): Promise<SubstackPost[]> {
  try {
    const res = await fetch("https://ichancellor.substack.com/feed", {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PortfolioApp/1.0",
      },
    });

    if (!res.ok) {
      console.warn(`Substack RSS fetch returned status ${res.status}`);
      return FALLBACK_POSTS;
    }

    const xml = await res.text();
    const items = xml.split("<item>");
    
    if (items.length <= 1) {
      return FALLBACK_POSTS;
    }

    const posts: SubstackPost[] = [];

    for (let i = 1; i < items.length; i++) {
      const itemChunk = items[i].split("</item>")[0];

      // Extract title
      const titleMatch = itemChunk.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const rawTitle = titleMatch ? cleanCdata(titleMatch[1]) : "";
      const title = decodeHtmlEntities(cleanHtml(rawTitle));

      // Extract link
      const linkMatch = itemChunk.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
      const link = linkMatch ? cleanCdata(linkMatch[1]).trim() : "";

      // Extract description
      const descMatch = itemChunk.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
      const rawDesc = descMatch ? cleanCdata(descMatch[1]) : "";
      const description = decodeHtmlEntities(cleanHtml(rawDesc));

      // Extract pubDate
      const dateMatch = itemChunk.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i);
      const pubDate = dateMatch ? cleanCdata(dateMatch[1]).trim() : "";

      // Extract enclosure audio url
      const enclosureMatch = itemChunk.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
      const audioUrl = enclosureMatch ? enclosureMatch[1] : undefined;

      if (title && link) {
        posts.push({
          title,
          link,
          pubDate,
          description,
          audioUrl,
        });
      }
    }

    return posts.length > 0 ? posts : FALLBACK_POSTS;
  } catch (err) {
    console.error("Error fetching Substack RSS feed:", err);
    return FALLBACK_POSTS;
  }
}

function cleanCdata(str: string): string {
  return str.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function cleanHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8212;/g, "—")
    .replace(/&#8211;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}
