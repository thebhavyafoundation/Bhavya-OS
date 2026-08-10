# Social Hub

## Overview

A unified Social Hub page that aggregates all Bhavya Foundation social presence into one place.

## Social Channels

### GitHub

**URL:** github.com/bhavya-foundation
**Content:** Repositories, contributions, stars, releases
**Embed:** GitHub profile README or pinned repos widget

### LinkedIn

**URL:** linkedin.com/company/bhavya-foundation
**Content:** Company updates, job posts, articles
**Embed:** LinkedIn page feed widget

### YouTube

**URL:** youtube.com/@bhavyafoundation
**Content:** Tutorials, lectures, project walkthroughs
**Embed:** YouTube channel feed

### X (Twitter)

**URL:** x.com/bhavyafoundation
**Content:** Updates, threads, engagement
**Embed:** Twitter timeline widget

### Instagram

**URL:** instagram.com/bhavyafoundation
**Content:** Behind-the-scenes, community highlights
**Embed:** Instagram feed widget

### Discord

**URL:** discord.gg/bhavyafoundation
**Content:** Community chat, support, events
**Embed:** Discord server widget / invite link

### Newsletter

**URL:** bhavyafoundation.org/newsletter
**Content:** Weekly digest, updates, featured content
**Embed:** Email signup form

## Social Hub Page Structure

```
/social
├── Hero: "Join the Community"
├── Newsletter Signup (prominent)
├── GitHub Widget (pinned repos, recent activity)
├── YouTube Widget (latest videos)
├── Discord Widget (online members, invite)
├── LinkedIn Widget (company updates)
├── X Widget (latest tweets)
├── Instagram Widget (latest posts)
├── Community Stories (testimonials)
└── Events Calendar (upcoming events)
```

## Component Design

### Newsletter Signup Component

```astro
---
// components/NewsletterSignup.astro
---

<section class="newsletter-signup">
  <h2>Stay Updated</h2>
  <p>Get the latest AI education content, course updates, and community highlights.</p>

  <form action="/api/subscribe" method="POST">
    <input type="email" name="email" placeholder="your@email.com" required />
    <button type="submit">Subscribe</button>
  </form>

  <p class="privacy">No spam. Unsubscribe anytime.</p>
</section>
```

### GitHub Activity Component

```astro
---
// components/GitHubActivity.astro
const repos = await fetch('https://api.github.com/users/bhavya-foundation/repos?sort=stars&per_page=6');
---

<section class="github-activity">
  <h2>Open Source</h2>
  <div class="repos-grid">
    {repos.map(repo => (
      <a href={repo.html_url} class="repo-card">
        <h3>{repo.name}</h3>
        <p>{repo.description}</p>
        <div class="stats">
          <span>⭐ {repo.stargazers_count}</span>
          <span>🔀 {repo.forks_count}</span>
        </div>
      </a>
    ))}
  </div>
</section>
```

### YouTube Channel Component

```astro
---
// components/YouTubeChannel.astro
---

<section class="youtube-channel">
  <h2>Learn on YouTube</h2>
  <div class="videos-grid">
    <!-- YouTube embed or API feed -->
  </div>
  <a href="https://youtube.com/@bhavyafoundation" class="subscribe-btn">
    Subscribe on YouTube
  </a>
</section>
```

### Discord Widget Component

```astro
---
// components/DiscordWidget.astro
---

<section class="discord-widget">
  <h2>Join Our Discord</h2>
  <div class="widget-container">
    <iframe
      src="https://discord.com/widget?id=YOUR_SERVER_ID&theme=dark"
      width="350"
      height="500"
      allowtransparency="true"
      frameborder="0"
    ></iframe>
  </div>
</section>
```

### Social Links Component

```astro
---
// components/SocialLinks.astro
const socials = [
  { name: 'GitHub', url: 'https://github.com/bhavya-foundation', icon: 'github' },
  { name: 'LinkedIn', url: 'https://linkedin.com/company/bhavya-foundation', icon: 'linkedin' },
  { name: 'YouTube', url: 'https://youtube.com/@bhavyafoundation', icon: 'youtube' },
  { name: 'X', url: 'https://x.com/bhavyafoundation', icon: 'x' },
  { name: 'Instagram', url: 'https://instagram.com/bhavyafoundation', icon: 'instagram' },
  { name: 'Discord', url: 'https://discord.gg/bhavyafoundation', icon: 'discord' },
];
---

<div class="social-links">
  {socials.map(social => (
    <a href={social.url} target="_blank" rel="noopener noreferrer" class="social-link">
      <span class="icon">{social.icon}</span>
      <span class="name">{social.name}</span>
    </a>
  ))}
</div>
```

## Footer Integration

**Footer includes all social links:**

```astro
<footer class="site-footer">
  <div class="social-links">
    <a href="https://github.com/bhavya-foundation">GitHub</a>
    <a href="https://linkedin.com/company/bhavya-foundation">LinkedIn</a>
    <a href="https://youtube.com/@bhavyafoundation">YouTube</a>
    <a href="https://x.com/bhavyafoundation">X</a>
    <a href="https://discord.gg/bhavyafoundation">Discord</a>
  </div>
</footer>
```

## Content Sync Strategy

### Automated Sync

- **GitHub:** Webhook for new releases, stars
- **YouTube:** RSS feed for new videos
- **Blog:** RSS feed for new posts
- **Newsletter:** Email service integration

### Manual Updates

- **LinkedIn:** Company page updates
- **Instagram:** Community highlights
- **Discord:** Event announcements

## Design Principles

1. **Unified:** All channels in one place
2. **Live:** Real-time activity feeds
3. **Actionable:** Clear CTAs to join each channel
4. **Beautiful:** Consistent with Bhavya design system
5. **Fast:** No performance impact from embeds

## Implementation Plan

### Phase 1: Static Links

- Add social links to footer
- Create /social page with links

### Phase 2: Embeds

- Add Discord widget
- Add GitHub pinned repos
- Add YouTube latest videos

### Phase 3: Live Feeds

- GitHub activity feed
- Newsletter signup integration
- Social media aggregation

### Phase 4: Community Features

- Member spotlight
- Project showcases
- Event calendar
