FROM node:20-alpine

WORKDIR /usr/src/app

COPY ../packages ./packages
COPY ./yarn.lock ./yarn.lock

COPY ./package.json ./package.json

RUN yarn install

COPY ../apps/ws/ ./ws

EXPOSE 8000

CMD [ "cd", "ws", "yarn", "run", "dev" ]
