FROM node:14

RUN apk add --no-cache git alpine-sdk

ADD . /app
WORKDIR /app

RUN npm install && npm run build
CMD ["npm", "start"]