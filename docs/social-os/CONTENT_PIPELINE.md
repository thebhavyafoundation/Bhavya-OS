# Social OS — Content Pipeline

## Pipeline Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     CONTENT PIPELINE                              │
│                                                                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ Knowledge │───►│ Content  │───►│ Social   │───►│ Postiz   │  │
│  │ Package   │    │ Factory  │    │ OS       │    │ Publishing│  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│                                                                   │
│  Research ──► Creation ──► Approval ──► Publishing ──► Analytics  │
└──────────────────────────────────────────────────────────────────┘
```

## Stage 1: Knowledge Package → Content Factory

When a Knowledge Package is published, Content Factory generates platform-specific content:

| Artifact       | Generated Content                                |
| -------------- | ------------------------------------------------ |
| KP Lesson      | LinkedIn article, X thread, GitHub README update |
| KP Assessment  | Community quiz post, Discord challenge           |
| KP Workbook    | Instagram carousel, YouTube short                |
| KP Visual Spec | YouTube thumbnail, LinkedIn image                |
| KP Website     | Blog post, newsletter content                    |

### Content Generation Rules

```typescript
interface ContentGenerator {
  generateFromKP(kp: KnowledgePackage): PlatformContent[];
  generateFromBlog(blog: BlogPost): PlatformContent[];
  generateFromAnnouncement(announcement: Announcement): PlatformContent[];
}
```

## Stage 2: Content Factory → Social OS

Content Factory emits `content.ready` events:

```json
{
  "eventType": "content.ready",
  "data": {
    "title": "KP-001: How Large Language Models Work",
    "content": "Just published our first Knowledge Package...",
    "platforms": ["linkedin", "x", "github"],
    "media": [
      {
        "type": "image",
        "url": "https://bhavya.org/assets/kp-001-cover.png",
        "altText": "KP-001 Cover"
      }
    ],
    "source": {
      "type": "knowledge_package",
      "knowledgePackageId": "KP-001",
      "version": "1.0.0"
    }
  }
}
```

## Stage 3: Social OS Processing

Social OS receives the event and:

1. **Creates publication draft** with platform-specific formatting
2. **Formats for each platform** (character limits, hashtags, mentions)
3. **Attaches media** with platform optimizations
4. **Submits for human approval**
5. **Waits for approval**
6. **Schedules in Postiz** on approval
7. **Monitors publishing status**
8. **Collects analytics** after publishing

## Stage 4: Platform Formatting

### LinkedIn

```
Max length: 3,000 characters
Format: Professional, educational
Hashtags: 3-5 relevant tags
Media: Images (1200x627), Documents, Video
Best time: Tue-Thu, 8-10 AM
```

### X (Twitter)

```
Max length: 280 characters (use thread for longer)
Format: Concise, engaging, conversational
Hashtags: 1-2 max
Media: Images (1600x900), GIFs, Video (2:20 max)
Best time: Mon-Fri, 9 AM, 12 PM, 5 PM
```

### GitHub

```
Format: Technical, detailed
Media: None (text only)
Best time: Tue-Thu, 10 AM-2 PM
```

### YouTube

```
Format: Educational, tutorial
Media: Thumbnails (1280x720), Videos
Best time: Fri-Sat, 12-3 PM
```

### Instagram

```
Max length: 2,200 characters
Format: Visual-first, inspirational
Hashtags: 5-10 relevant tags
Media: Images (1080x1080), Carousels, Reels
Best time: Mon-Fri, 11 AM-1 PM
```

## Stage 5: Analytics Feedback

After publishing, analytics flow back:

```
Postiz API → Social OS → Analytics Store → GitHub OS Research
```

GitHub OS uses analytics to:

- Identify best posting times per platform
- Determine which content types get most engagement
- Optimize future content generation
- Update the Social Intelligence research domain
