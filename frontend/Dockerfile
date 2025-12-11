# Stage 0: Install build and runtime dependencies
FROM node:bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Install ALL dependencies (dev and production)
RUN npm install


# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder
WORKDIR /app
# Copy the installed dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the source code
COPY . .
# Build the Next.js app
RUN npm run build


# Stage 2: Final production image (Runtime)
# Use a smaller image for production if possible, or stick with node:18-alpine
FROM node:bookworm-slim AS frontend
WORKDIR /app

# The Next.js production server needs three main things:

# 1. The built application (.next) and static assets (public)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 2. Production dependencies (node_modules). This copies ONLY the dependencies needed for the server to run.
# Since we used 'npm install' with dev dependencies in 'deps', we should re-run 'npm install --omit=dev' or use PnP/pnpm.
# A simpler and more robust approach is to copy the production dependencies directly from the builder stage
# if you know they don't contain excessive dev dependencies.
COPY --from=builder /app/node_modules ./node_modules

# 3. Source code and Configuration files (package.json, next.config.js, etc.)
# These are required for the Next.js server to correctly locate and configure the app.
COPY --from=builder /app/package.json ./package.json 
# If you have a next.config.js, copy it as well
# COPY next.config.js ./

# Set the environment variable for production
ENV NODE_ENV production

# Expose the frontend port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]