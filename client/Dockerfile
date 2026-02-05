# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app

ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_BACKEND_URL

COPY package*.json ./
RUN npm install
COPY . .

# Inject build-time env variables for Vite
RUN echo "VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY" > .env
RUN echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" >> .env

RUN npm run build

# Stage 2: serve static files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
