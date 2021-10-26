FROM node:16.12.0-alpine3.14

COPY --chown=node:node . /usr/src/app
WORKDIR /usr/src/app

RUN apk add dumb-init
RUN npm install --loglevel error && npm run build

ENTRYPOINT ["/usr/bin/dumb-init"]

USER node
CMD ["npm", "start"]