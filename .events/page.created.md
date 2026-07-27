# Event: page.created

## Description

Triggered when a new page is created.

## Payload

- `pageId`: New page identifier
- `title`: Page title
- `path`: Page path
- `author`: Agent who created the page

## Subscribers

- SEO Agent (add to sitemap)
- Historian Agent (log creation)
- Researcher Agent (index content)

## Actions

1. Add to sitemap
2. Index content
3. Log creation
4. Notify stakeholders
