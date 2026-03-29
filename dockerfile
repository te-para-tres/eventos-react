FROM node:20-alpine AS builder

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=1024"

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]