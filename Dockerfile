FROM node:alpine

WORKDIR /usr/app

COPY ./package*.json ./

RUN npm i -g pm2 \
    && npm install --legacy-peer-deps


COPY ./ ./

RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]