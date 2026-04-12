# Stage 1: Build the frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
# We will run npm install later when frontend package.json is ready
# For now, we will add a dummy package.json in the docker build if it's missing or handle it
# Actually, since we're using a single Dockerfile, we will COPY the frontend code and build it.
COPY frontend/ ./
RUN npm install || true
RUN npm run build || true

# Stage 2: Build the backend
FROM node:18
WORKDIR /app/backend

# Copy package files and install dependencies
COPY backend/package*.json ./
RUN npm install || true

# Copy backend source code
COPY backend/ ./

# Copy built frontend files to the backend public directory
# (Assuming the backend serves files from the 'public' or 'dist' dir)
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose port 6003
EXPOSE 6003

# Start the application
CMD ["npm", "start"]
