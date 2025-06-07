# =========================
# STAGE 1: Build
# =========================
FROM node:18-alpine AS build

WORKDIR /app

# Copy package info and install deps
COPY package*.json ./
RUN npm ci

# Copy toàn bộ source code (trừ những gì bị ignore)
COPY . .

# Build project
RUN npm run build


# =========================
# STAGE 2: Runtime
# =========================
FROM node:18-alpine AS runtime

WORKDIR /app

# Copy chỉ các file cần thiết để chạy production
COPY --from=build /app/package*.json ./
COPY --from=build /app/server.js ./
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=build /app/.env.example ./.env 

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "server.js"]
