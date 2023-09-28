#! /bin/bash
set -e

while ! pg_isready -h ${DATABASE_HOST:-db} -p ${DATABASE_PORT:-5432} | grep -q 'accept'; do
  echo "Cannot connect to DB, retrying in 4 seconds..."
  sleep 4
done
echo "DB Ready, Starting..."

if [ "$NODE_ENV" == "production" ]
  then
    node dist/src/main
  else
    npm run start:dev
  fi
