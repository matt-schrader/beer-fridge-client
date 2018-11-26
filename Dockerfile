FROM node:11

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 3333

CMD [ "node", "server.js", "-e", "PROXY_HOST=beer-fridge:3030", "-e" ]