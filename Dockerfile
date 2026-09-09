# ============================================================
# Bhavya Foundation — Production Dockerfile (multi-stage)
# Usage: docker build --build-arg APP_NAME=ai-institute -t bhavya/ai-institute .
# ============================================================

# ----------------------------------------------------------
# Stage 1: base — common runtime for all apps
# ----------------------------------------------------------
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat tini curl
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate

RUN addgroup -g 1001 -S bhavya && \
    adduser -S bhavya -u 1001 -G bhavya

WORKDIR /app

# ----------------------------------------------------------
# Stage 2: deps — install all workspace dependencies
# ----------------------------------------------------------
FROM base AS deps

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Copy workspace package manifests (only those that exist)
COPY packages/auth/package.json packages/auth/
COPY packages/database/package.json packages/database/
COPY packages/platform-ui/package.json packages/platform-ui/
COPY packages/shared/package.json packages/shared/
COPY packages/content-core/package.json packages/content-core/
COPY packages/eslint/package.json packages/eslint/
COPY packages/typescript/package.json packages/typescript/

# Copy app manifests
COPY apps/ai-institute/package.json apps/ai-institute/
COPY apps/admin/package.json apps/admin/
COPY apps/docs/package.json apps/docs/
COPY apps/website/package.json apps/website/
COPY apps/social-os/package.json apps/social-os/
COPY apps/ioc/package.json apps/ioc/
COPY apps/bhavya-intelligence-network/package.json apps/bhavya-intelligence-network/
COPY apps/design-system/package.json apps/design-system/
COPY apps/github-os/package.json apps/github-os/

RUN pnpm install --frozen-lockfile || pnpm install --no-frozen-lockfile

# ----------------------------------------------------------
# Stage 3: builder — build a specific app
# ----------------------------------------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps ./apps
COPY . .

ARG APP_NAME=ai-institute
ARG NODE_ENV=production

ENV NODE_ENV=$NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter @bhavya/$APP_NAME build

# ----------------------------------------------------------
# Stage 4: runner — minimal production image
# ----------------------------------------------------------
FROM base AS runner

ARG APP_NAME=ai-institute
ARG PORT=3000

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=$PORT

WORKDIR /app

# Copy standalone output if available, otherwise copy minimal files
COPY --from=builder /app/apps/$APP_NAME/.next/standalone ./app
COPY --from=builder /app/apps/$APP_NAME/.next/static ./app/.next/static
COPY --from=builder /app/apps/$APP_NAME/public ./app/public

# Copy database directory (needed for local SQLite)
COPY --from=builder /app/packages/database ./packages/database

RUN chown -R bhavya:bhavya /app

USER bhavya

EXPOSE $PORT

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:$PORT/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "app/server.js"]
