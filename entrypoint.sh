#!/bin/sh
set -e

if [ -n "${DB_PASSWORD:-}" ]; then
  ENCODED_DB_PASSWORD="$(node -e 'process.stdout.write(encodeURIComponent(process.env.DB_PASSWORD))')"
  export DATABASE_URL="postgresql://mcquser:${ENCODED_DB_PASSWORD}@postgres:5432/mcqdb?schema=public"
fi

echo "Applying database schema..."
npx prisma db push --skip-generate

echo "Seeding MCQ questions..."
node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.question.count().then(c => {
  if (c > 35) {
    console.log('Cleaning up ' + c + ' duplicate questions...');
    return p.question.deleteMany().then(() => console.log('Cleaned. Re-seeding...'));
  }
}).finally(() => p.\$disconnect());
"
npx prisma db seed

echo "Starting SL Accounting MCQ..."
exec node server.js
