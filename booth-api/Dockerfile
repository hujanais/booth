# for ARM SBC
FROM node:18-bullseye-slim

# Set the working directory
WORKDIR /usr/src/app

# copy package.json
COPY package.json ./

# install dependencies
RUN npm install

COPY . .

# build application
RUN npm run build

# EXPORT port 3000
EXPOSE 3000

# execute the application.
CMD ["npm", "run", "start"]