#!/bin/sh
set -e

if [ -f /app/.env.docker ]; then
  set -a
  # shellcheck disable=SC1091
  . /app/.env.docker
  set +a
fi

export DIRECT_URL="${DIRECT_URL:-$DATABASE_URL}"

echo "Running Prisma migrations…"
bun run prisma:migrate:deploy

echo "Starting Next.js…"
exec bun run start:docker
