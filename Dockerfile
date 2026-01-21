FROM node:alpine

WORKDIR /usr/app

COPY ./package*.json ./

RUN npm i -g pm2 \
    && npm install --legacy-peer-deps


COPY ./ ./

# Create logs directory for PM2
RUN mkdir -p ./logs

# Build in production mode so .env.production is used
ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]