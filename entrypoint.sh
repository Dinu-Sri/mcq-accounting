#!/bin/sh
set -e

if [ -n "${DB_PASSWORD:-}" ]; then
  ENCODED_DB_PASSWORD="$(node -e 'process.stdout.write(encodeURIComponent(process.env.DB_PASSWORD))')"
  export DATABASE_URL="postgresql://mcquser:${ENCODED_DB_PASSWORD}@postgres:5432/mcqdb?schema=public"
fi

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Starting SL Accounting MCQ..."
exec node server.js
