import type {
  PlatformType,
  PlatformContent,
  PlatformConstraints,
} from "../lib/types.js";

const PLATFORM_RULES: Record<PlatformType, (text: string) => string> = {
  linkedin: (text) => {
    if (text.length > 3000) return text.slice(0, 2997) + "...";
    return text;
  },
  x: (text) => {
    if (text.length > 280) {
      return text.slice(0, 277) + "...";
    }
    return text;
  },
  github: (text) => {
    if (text.length > 65536) return text.slice(0, 65533) + "...";
    return text;
  },
  youtube: (text) => {
    if (text.length > 5000) return text.slice(0, 4997) + "...";
    return text;
  },
  instagram: (text) => {
    if (text.length > 2200) return text.slice(0, 2197) + "...";
    return text;
  },
  newsletter: (text) => {
    if (text.length > 10000) return text.slice(0, 9997) + "...";
    return text;
  },
  discord: (text) => {
    if (text.length > 2000) return text.slice(0, 1997) + "...";
    return text;
  },
  website: (text) => text,
};

const HASHTAG_STRATEGIES: Record<PlatformType, (tags: string[]) => string[]> = {
  linkedin: (tags) => tags.slice(0, 5),
  x: (tags) => tags.slice(0, 3),
  github: () => [],
  youtube: (tags) => tags.slice(0, 15),
  instagram: (tags) => tags.slice(0, 30),
  newsletter: (tags) => tags.slice(0, 10),
  discord: (tags) => tags.slice(0, 5),
  website: (tags) => tags,
};

const CHARACTER_LIMITS: Record<PlatformType, number> = {
  linkedin: 3000,
  x: 280,
  github: 65536,
  youtube: 5000,
  instagram: 2200,
  newsletter: 10000,
  discord: 2000,
  website: Infinity,
};

export function formatForPlatform(
  content: string,
  platform: PlatformType,
  hashtags: string[] = [],
): PlatformContent {
  const formatter = PLATFORM_RULES[platform];
  const text = formatter(content);
  const limitedHashtags = HASHTAG_STRATEGIES[platform](hashtags);
  const maxChars = CHARACTER_LIMITS[platform];

  return {
    platform,
    text,
    media: [],
    hashtags: limitedHashtags,
    mentions: [],
    characterCount: text.length + limitedHashtags.join(" ").length,
    isWithinLimits: text.length + limitedHashtags.join(" ").length <= maxChars,
  };
}

export function formatForAllPlatforms(
  content: string,
  platforms: PlatformType[],
  hashtags: string[] = [],
): Record<PlatformType, PlatformContent> {
  const result: Record<string, PlatformContent> = {};
  for (const platform of platforms) {
    result[platform] = formatForPlatform(content, platform, hashtags);
  }
  return result as Record<PlatformType, PlatformContent>;
}

export function extractHashtags(content: string): string[] {
  const matches = content.match(/#[\w]+/g);
  return matches ? matches.map((m) => m.slice(1)) : [];
}

export function addHashtags(content: string, hashtags: string[]): string {
  if (hashtags.length === 0) return content;
  const tagString = hashtags.map((t) => `#${t}`).join(" ");
  return `${content}\n\n${tagString}`;
}
