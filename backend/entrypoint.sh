#!/bin/bash

# Import environment variables
source .env

# Ensure an environment argument is provided
if [ -z "$1" ]; then
    echo "Usage: $0 {dev|prod}"
    exit 1
fi

# Ensure the environment argument is valid
if [ "$1" != "dev" ] && [ "$1" != "prod" ]; then
    echo "Usage: $0 {dev|prod}"
    exit 1
fi

# Function to wait for PostgreSQL to be ready
wait_for_postgres() {
    while ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do
        echo "$(date +'%Y-%m-%d %H:%M:%S') - Waiting for PostgreSQL to be ready..."
        sleep 10
    done
}

# Wait for PostgreSQL
wait_for_postgres

# Run Prisma migration based on the environment argument
if [ "$1" == "dev" ]; then
    # Run Prisma migration for development

    npx prisma db push --force-reset
elif [ "$1" == "prod" ]; then
    # Run Prisma migration for production
    npx prisma migrate deploy
fi

# Start your application based on the environment argument
if [ "$1" == "dev" ]; then
    npm run start:dev
elif [ "$1" == "prod" ]; then
    node dist/main
fi
