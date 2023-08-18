# Building
FROM node:16 AS builder

WORKDIR /usr/src/app-build

# First, copy the dependency files to leverage Docker caching.
COPY package*.json ./
RUN npm ci

# Copy the rest of the files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Run the build
RUN npm run build

# Running
FROM node:16

WORKDIR /usr/src/app

# Create a non-root user to run the application for added security.
RUN chown -R node:node /usr/src/app
USER node

# Copy built files from the build step.
COPY --from=builder /usr/src/app-build/dist ./dist

# Copy the dependency files and install only the production dependencies.
COPY package*.json ./
RUN npm ci --only=production

EXPOSE 3000
CMD [ "node", "dist/main" ]