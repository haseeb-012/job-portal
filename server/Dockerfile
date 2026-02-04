# Step 1: Use official Node LTS image
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --production

# Step 5: Install PM2 globally
RUN npm install pm2 -g

# Step 6: Copy application code
COPY . .

# Step 7: Expose backend port
EXPOSE 5000

# Step 8: Set environment variables file location (optional)
ENV NODE_ENV=production

# Step 9: Start app with PM2 cluster mode (all available cores)
CMD ["pm2-runtime", "start", "server.js", "-i", "max"]
