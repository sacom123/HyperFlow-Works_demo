# Multi-stage build for production
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@10.10.0

WORKDIR /app

# Copy workspace configuration and root package files first
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy package files for all workspaces
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source files (after dependencies are installed)
COPY . .

# Build (this will use the devDependencies we just installed)
# Use pnpm exec to ensure we use the correct binaries from node_modules
RUN pnpm --filter frontend build && pnpm --filter backend build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.10.0

# Copy workspace configuration and package files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod --shamefully-hoist

# Copy built files
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/backend/dist ./backend/dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose ports
EXPOSE 3000

# Start backend (serves both API and frontend static files)
CMD ["node", "backend/dist/index.js"]

