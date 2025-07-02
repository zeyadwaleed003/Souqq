FROM node AS base

WORKDIR /app
# Need to copy package-lock.json to use npm ci
COPY package*.json . 

# development stage
FROM base AS development

RUN npm i
COPY . .
CMD ["npm", "run", "dev"]

# builder stage - Needed for the production stage
FROM base AS builder

RUN npm ci
COPY . .
RUN npm run build

# production stage
FROM base AS production

RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
CMD [ "npm", "run", "start" ]