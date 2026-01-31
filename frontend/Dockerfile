# Stage 1: build
FROM node:22.14.0-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build   # outputs /app/dist for Vite

# Stage 2: serve
FROM node:22.14.0-alpine
RUN npm install -g serve
WORKDIR /app

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
