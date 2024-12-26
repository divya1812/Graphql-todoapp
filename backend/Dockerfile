# Use official Node.js image as base
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the .env file into the container
COPY .env .env

# Copy all application files
COPY . .

# Expose the port your app will run on (e.g., 4000)
EXPOSE 4000

# Start the application with ts-node
CMD ["npx", "ts-node", "src/app.ts"]
