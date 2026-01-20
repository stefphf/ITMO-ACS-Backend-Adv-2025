FROM node:20 AS dependencies

ENV NODE_ENV=production

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=optional

FROM node:20 AS prod

ENV NODE_ENV=production

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "prod"]
