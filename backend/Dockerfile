FROM node:18-alpine

# Set working directory
WORKDIR /app

# Accept build-time arguments
ARG GROQ_API_KEY
ARG JWT_SECRET
ARG MONGO_URI

# Set environment variables
ENV GROQ_API_KEY=${GROQ_API_KEY}
ENV JWT_SECRET=${JWT_SECRET}
ENV MONGO_URI=${MONGO_URI}

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application
COPY . .

# Expose the application port (e.g., 3001)
EXPOSE 3001

# Run the server
CMD ["node", "index.js"]
