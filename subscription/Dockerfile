# Base image
FROM node:20.11.1-alpine
RUN ls -lah
# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build


# Start the server using the production build
CMD ["/bin/sh","node-server-init.sh" ]
