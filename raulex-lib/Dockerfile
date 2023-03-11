FROM node

WORKDIR /usr/app

COPY nodemon.json .
COPY package*.json .
COPY tsconfig.json .
COPY jest.config.js .

RUN npm install


CMD ["npm", "run", "dev"]