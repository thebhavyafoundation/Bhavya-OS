# Event: website.updated

## Description

Triggered when the website is updated with new content or features.

## Payload

- `page`: Page identifier
- `changes`: List of changes
- `author`: Agent or user who made the change
- `timestamp`: When the change was made

## Subscribers

- SEO Agent (update sitemap)
- SocialMedia Agent (share update)
- Historian Agent (log change)

## Actions

1. Update sitemap
2. Purge CDN cache
3. Notify subscribers
4. Log change
