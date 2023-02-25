FROM node:17

# Working dir
WORKDIR /usr/src/app

# Copy files from Build
COPY package*.json ./

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install -y chromium-browser && rm -rf /var/lib/apt/lists/*

# Install Globals
RUN npm install

# Install Files
RUN npm install 

# Copy SRC
COPY . .

# Build
# RUN npm run build

# Open Port
EXPOSE 4343

# Docker Command to Start Service
CMD [ "node", "app.js" ]