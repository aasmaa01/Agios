# server/Dockerfile
FROM node:22.12.0-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5000
CMD ["npm", "start", "dev"]
