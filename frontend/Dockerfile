### Build phase ###
FROM node:18 AS build

WORKDIR /usr/src/app-build

# First, copy the dependency files to leverage Docker caching.
COPY package*.json ./
RUN npm ci

# Copy the rest of the files
COPY . .

# Run the build
RUN npm run build

### Execution phase ###
FROM nginx:alpine

COPY --from=build /usr/src/app-build/build/ /usr/share/nginx/html/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]