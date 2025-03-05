FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=optional

COPY . .
RUN npm run build || cat /app/npm-debug.log


FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Add custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
