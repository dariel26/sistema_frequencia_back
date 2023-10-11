FROM node:20-alpine
WORKDIR /usr/src/app
COPY . ./
RUN yarn && yarn build
EXPOSE 5000
CMD ["node", "build/index.js"]