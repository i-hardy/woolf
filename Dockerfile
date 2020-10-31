FROM node:14-alpine

ADD . /app
WORKDIR /app

RUN npm install --loglevel error && npm run build
CMD ["npm", "start"]