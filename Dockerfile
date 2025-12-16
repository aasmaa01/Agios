# client/Dockerfile
FROM node:22.14.0-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# build React app
RUN npm run build

# use a lightweight web server for static files
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

EXPOSE 3000
