#!/bin/bash

source .env

# Check if an environment argument is provided
if [ -z "$1" ]; then
    echo "Usage: $0 {dev|prod}"
    exit 1
fi

# Check if a valid environment argument is provided
if [ "$1" != "dev" ] && [ "$1" != "prod" ]; then
    echo "Usage: $0 {dev|prod}"
    exit 1
fi

# Function to wait for PostgreSQL to be ready
# wait_for_postgres() {
#     until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do
#         echo "Waiting for PostgreSQL to be ready..."
#         sleep 1
#     done
# }

# # Wait for PostgreSQL
# wait_for_postgres

# Run Prisma migration based on the environment argument
if [ "$1" == "dev" ]; then
    # Run Prisma migration for development
    npx prisma migrate dev
elif [ "$1" == "prod" ]; then
    # Run Prisma migration for production (deploy)
    npx prisma migrate deploy
	# npx prisma migrate dev
fi

# Start your application based on the environment argument
if [ "$1" == "dev" ]; then
    npm run start:dev
elif [ "$1" == "prod" ]; then
    node dist/main
fi
