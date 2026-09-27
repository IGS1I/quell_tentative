FROM node:22-slim

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install --legacy-peer-deps -g @angular/cli

RUN npm install --legacy-peer-deps

CMD ["ng", "serve", "--host", "0.0.0.0"]
