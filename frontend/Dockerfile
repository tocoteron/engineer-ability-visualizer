FROM node:14.11.0-alpine3.12

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install

COPY . .