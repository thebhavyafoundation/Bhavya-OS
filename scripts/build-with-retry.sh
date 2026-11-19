#!/bin/sh
# build-with-retry.sh - run the application build, retrying a transient failure.
#
# WHY
# ---
# `next/font/google` downloads the font CSS from fonts.googleapis.com while
# the application is being built. On a GitHub Actions runner that request
# fails intermittently, and the loader then throws
#
#   TypeError: Cannot read properties of null (reading '1')
#
# The same tree has built successfully and unsuccessfully on different
# runs, so the failure is in the network, not in the code. The failure has
# been observed on three separate runs of this branch.
#
# WHAT THIS DOES
# --------------
# It runs the given build command again after a failure, a bounded number of
# times. Nothing else is retried: a genuine compile error fails on every
# attempt, and the step still fails, with the real error in the log.
#
# Usage:
#   sh scripts/build-with-retry.sh                       # the application build
#   sh scripts/build-with-retry.sh pnpm build            # the whole workspace
#
# Environment:
#   ATTEMPTS  how many attempts to make (default 3)
#   DELAY     seconds to wait between attempts (default 20)
set -e

ATTEMPTS=${ATTEMPTS:-3}
DELAY=${DELAY:-20}

if [ "$#" -gt 0 ]; then
  COMMAND="$@"
else
  COMMAND="pnpm --filter ai-institute run build"
fi

attempt=1
while [ "$attempt" -le "$ATTEMPTS" ]; do
  echo "[build] attempt $attempt of $ATTEMPTS: $COMMAND"
  if $COMMAND; then
    echo "[build] succeeded on attempt $attempt"
    exit 0
  fi
  if [ "$attempt" -ge "$ATTEMPTS" ]; then
    echo "[build] failed on all $ATTEMPTS attempts; the last failure above is the real one" >&2
    exit 1
  fi
  echo "[build] attempt $attempt failed; retrying in ${DELAY}s" >&2
  sleep "$DELAY"
  attempt=$((attempt + 1))
done
