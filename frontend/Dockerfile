# Building
FROM node:16 AS builder

WORKDIR /usr/src/app-build

# First, copy the dependency files to leverage Docker caching.
COPY package*.json ./
RUN npm install

# Copy the rest of the files
COPY . .

# Run the build
RUN npm run build

# Running
FROM nginx:alpine

COPY --from=builder /usr/src/app-build/ /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]