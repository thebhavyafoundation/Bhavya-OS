FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN corepack enable pnpm

# Setup workspace
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile

# Expose a default port (apps will override)
EXPOSE 3000

# Default command for development
CMD ["pnpm", "run", "dev"]
