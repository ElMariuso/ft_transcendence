# Building
FROM node:18 as build

WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

# Running
FROM node:18-slim

RUN apt-get update -y && apt-get install libssl-dev -y --no-install-recommends
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
#COPY --from=build /usr/src/app/.env .env
COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/package-lock.json .
RUN npm install --omit=dev
COPY --from=build /usr/src/app/node_modules/.prisma/client  ./node_modules/.prisma/client
ENV NODE_ENV production
EXPOSE 3000
CMD ["npm", "run","start:prod"]