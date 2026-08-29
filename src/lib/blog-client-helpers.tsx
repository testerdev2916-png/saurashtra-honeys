import React from "react";
import drizzle from "@/assets/honey-drizzle.jpg";
import beeFarm from "@/assets/bee-farm.jpg";
import beeFlower from "@/assets/bee-flower.jpg";
import comb from "@/assets/honeycomb-bees.jpg";
import ajwain from "@/assets/prod-ajwain.jpg";
import family from "@/assets/family-honey.jpg";

export function resolvePostImage(url?: string | null, categoryOrSlug?: string | null): string {
  if (url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/"))) {
    return url;
  }
  const key = (categoryOrSlug || "").toLowerCase();
  if (key.includes("health") || key.includes("ajwain") || key.includes("benefit")) {
    return ajwain;
  }
  if (key.includes("farm") || key.includes("beekeeping") || key.includes("cycle")) {
    return beeFarm;
  }
  if (key.includes("ayurveda") || key.includes("remed") || key.includes("raw")) {
    return drizzle;
  }
  if (key.includes("sustain") || key.includes("planet") || key.includes("bloom") || key.includes("flora")) {
    return beeFlower;
  }
  if (key.includes("comb") || key.includes("hive")) {
    return comb;
  }
  if (key.includes("purity") || key.includes("nabl") || key.includes("unadulterated")) {
    return family;
  }
  return drizzle;
}

export function formatPostDate(isoString?: string | null): string {
  if (!isoString) return "May 14, 2024";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "May 14, 2024";
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  } catch {
    return "May 14, 2024";
  }
}

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function extractTableOfContents(markdown?: string | null): TocItem[] {
  if (!markdown) return [];
  const lines = markdown.split("\n");
  const toc: TocItem[] = [];
  let count = 0;

  for (const line of lines) {
    const trim = line.trim();
    if (trim.startsWith("## ")) {
      const text = trim.replace(/^##\s+/, "").trim();
      toc.push({
        id: `heading-${count++}`,
        text,
        level: 2,
      });
    } else if (trim.startsWith("### ")) {
      const text = trim.replace(/^###\s+/, "").trim();
      toc.push({
        id: `heading-${count++}`,
        text,
        level: 3,
      });
    }
  }

  return toc;
}

function parseInlineFormatting(text: string): React.ReactNode[] {
  // We handle inline bold (**bold**), italic (*italic*), and links ([title](url))
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-bold text-espresso">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic text-espresso/95">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("[")) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        parts.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-burnt-orange font-bold underline hover:text-terracotta transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        parts.push(token);
      }
    } else {
      parts.push(token);
    }
    lastIdx = regex.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }

  return parts.length === 0 ? [text] : parts;
}

export function renderMarkdown(markdown?: string | null): React.ReactNode[] {
  if (!markdown || !markdown.trim()) {
    return [];
  }

  const blocks = markdown.split(/\n\n+/);
  let headingCount = 0;

  return blocks.map((block, idx) => {
    const trim = block.trim();

    // Image ![alt](url)
    if (trim.startsWith("![") && trim.includes("](")) {
      const imgMatch = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(trim);
      if (imgMatch) {
        return (
          <div key={idx} className="my-8">
            <img
              src={imgMatch[2]}
              alt={imgMatch[1] || "Article illustration"}
              loading="lazy"
              className="w-full rounded-2xl shadow-soft border border-border/80 object-cover aspect-[16/9]"
            />
            {imgMatch[1] && (
              <p className="mt-2 text-center text-xs text-muted-foreground italic">
                {imgMatch[1]}
              </p>
            )}
          </div>
        );
      }
    }

    // Heading 2
    if (trim.startsWith("## ")) {
      const id = `heading-${headingCount++}`;
      const titleText = trim.replace(/^##\s+/, "");
      return (
        <h2
          key={idx}
          id={id}
          className="font-serif text-2xl md:text-3xl font-bold text-espresso mt-10 mb-4 pb-3 border-b border-border/60 scroll-mt-28"
        >
          {parseInlineFormatting(titleText)}
        </h2>
      );
    }

    // Heading 3
    if (trim.startsWith("### ")) {
      const id = `heading-${headingCount++}`;
      const titleText = trim.replace(/^###\s+/, "");
      return (
        <h3
          key={idx}
          id={id}
          className="font-serif text-xl md:text-2xl font-bold text-espresso mt-8 mb-3 scroll-mt-28"
        >
          {parseInlineFormatting(titleText)}
        </h3>
      );
    }

    // Blockquote
    if (trim.startsWith("> ")) {
      const quoteText = trim.replace(/^>\s*/gm, "");
      return (
        <blockquote
          key={idx}
          className="italic text-base md:text-lg text-espresso/95 bg-cream-deep/60 p-6 rounded-2xl border-l-4 border-burnt-orange my-6 shadow-xs leading-relaxed"
        >
          {parseInlineFormatting(quoteText)}
        </blockquote>
      );
    }

    // List
    if (trim.startsWith("- ") || trim.startsWith("* ")) {
      const items = trim.split("\n").map((line) => line.replace(/^[-*]\s+/, ""));
      return (
        <ul
          key={idx}
          className="list-disc list-inside space-y-2.5 my-6 text-[15px] leading-relaxed text-foreground/90 bg-cream/30 p-6 rounded-2xl border border-border/50"
        >
          {items.map((item, itemIdx) => (
            <li key={itemIdx} className="pl-1">
              {parseInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
    }

    // Default Paragraph
    return (
      <p
        key={idx}
        className="text-[15px] md:text-base text-foreground/90 leading-relaxed my-4"
      >
        {parseInlineFormatting(trim)}
      </p>
    );
  });
}
