# Step 1: Use Node.js image
FROM node:18

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the entire source code
COPY . .

# Step 5: Build the TypeScript code
RUN npm run build

# Step 6: Expose port and start the app
EXPOSE 3000
CMD ["npm", "run", "start"]
