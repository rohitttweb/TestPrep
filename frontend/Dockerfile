FROM node:20 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install 

COPY . .

# Pass environment variable
ARG API_URL
ENV API_URL=$API_URL

RUN npm run build 


FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Add custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
