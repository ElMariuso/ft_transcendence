### Build phase ###
FROM node:18 as build
WORKDIR /usr/src/app

# Copy package files and install dependencies using npm ci for a clean, reproducible build
COPY package*.json ./
RUN npm ci

# Copy all other files
COPY . .

# Generate the Prisma client and build the application
RUN npx prisma generate
RUN npm run build

### Execution phase ###
FROM node:18-slim

# Update, install necessary dependencies, then clean up to reduce image size
RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

# Copy necessary files from the build phase
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env .env
COPY --chown=node:node --from=build /usr/src/app/package*.json ./

# Install execution dependencies (excluding devDependencies)
RUN npm ci --omit=dev

# Copy prisma files
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client  ./node_modules/.prisma/client

# Define the user to run the application for added security
USER node

# Launching
ENV NODE_ENV production
EXPOSE 3000
CMD ["dumb-init", "node", "dist/main"]