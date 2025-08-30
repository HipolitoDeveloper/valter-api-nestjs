FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache openssl

RUN corepack enable

COPY package.json yarn.lock ./
COPY prisma ./prisma

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

RUN yarn install --immutable
COPY . .

RUN yarn prisma generate

RUN yarn build

EXPOSE 3000

CMD ["sh", "-c", "yarn prisma:push && yarn start:prod"]