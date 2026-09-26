# Frontend Dockerfile

# Choose image and rename
FROM --platform=$BUILDPLATFORM node:jod-trixie-slim as builder

# Create "frontend" directory and set as working directory
WORKDIR /frontend

# Install Angualr CLI version 13 using npm
RUN npm install -g @angular/cli@13

# Copy package files into remote frontend directory
COPY package.json package-lock.json ./

# Install node modules from package-lock.json
RUN npm ci

# Copy remaining files in current directory to remote frontend directory
COPY . .

# Set default command to run when the container starts
RUN ["ng", "server", "--host", "0.0.0.0"]
