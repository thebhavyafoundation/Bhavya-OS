# ============================================================
# Bhavya Foundation — Production Dockerfile (multi-stage)
# Usage: docker build --target website -t bhavya/website .
# ============================================================

# ----------------------------------------------------------
# Stage 1: base — common runtime for all apps
# ----------------------------------------------------------
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat tini curl
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN apk add --no-cache jq

# Non-root user
RUN addgroup -g 1001 -S bhavya && \
    adduser -S bhavya -u 1001 -G bhavya

WORKDIR /app

# ----------------------------------------------------------
# Stage 2: deps — install all workspace dependencies
# ----------------------------------------------------------
FROM base AS deps

# Copy workspace config
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/runtime/package.json packages/runtime/
COPY packages/mission-runtime/package.json packages/mission-runtime/
COPY packages/sdk/package.json packages/sdk/
COPY packages/ui/package.json packages/ui/
COPY packages/bdl/package.json packages/bdl/
COPY packages/branding/package.json packages/branding/
COPY packages/eslint/package.json packages/eslint/
COPY packages/typescript/package.json packages/typescript/

# Copy app manifests
COPY apps/website/package.json apps/website/
COPY apps/admin/package.json apps/admin/
COPY apps/docs/package.json apps/docs/
COPY apps/design-system/package.json apps/design-system/
COPY apps/transparency/package.json apps/transparency/

# Install dependencies (non-root won't work here yet due to pnpm store)
RUN pnpm install --frozen-lockfile || pnpm install --no-frozen-lockfile

# ----------------------------------------------------------
# Stage 3: builder — build a specific app
# ----------------------------------------------------------
FROM base AS builder

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps ./apps

# Copy source
COPY . .

# Build args — set via docker build --build-arg APP_NAME=website
ARG APP_NAME=website
ARG NODE_ENV=production

ENV NODE_ENV=$NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm --filter @bhavya/$APP_NAME build || \
    cd apps/$APP_NAME && npx next build

# ----------------------------------------------------------
# Stage 4: runner — minimal production image
# ----------------------------------------------------------
FROM base AS runner

ARG APP_NAME=website
ARG PORT=3000

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=$PORT

# Copy built app
WORKDIR /app

# Copy only what's needed for runtime
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=builder /app/apps/$APP_NAME/.next ./$APP_NAME/.next
COPY --from=builder /app/apps/$APP_NAME/package.json ./$APP_NAME/
COPY --from=builder /app/apps/$APP_NAME/next.config.ts ./$APP_NAME/

# Copy public assets if they exist
COPY --from=builder /app/apps/$APP_NAME/public ./$APP_NAME/public

# Copy config and data
COPY config/ ./config/
COPY registry/ ./registry/
COPY content/ ./content/
COPY navigation/ ./navigation/
COPY memory/ ./memory/

# Set ownership
RUN chown -R bhavya:bhavya /app

USER bhavya

EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:$PORT/api/health || exit 1

# Use tini as PID 1 for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start the app
CMD ["sh", "-c"]
