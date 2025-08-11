# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS dev
WORKDIR /app
ENV NODE_ENV=development
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install openssl for bcrypt on alpine
RUN apk add --no-cache bash openssl

# Install deps (dev + prod)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm install; \
    else npm install; fi

COPY . .
EXPOSE 3000
CMD ["npm","run","dev"]
