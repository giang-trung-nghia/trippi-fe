FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

ENV YARN_NETWORK_TIMEOUT=600000
RUN yarn install --network-timeout 600000

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start", "--", "-H", "0.0.0.0"]