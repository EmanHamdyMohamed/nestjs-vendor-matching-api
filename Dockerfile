FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules
RUN npm install --force
RUN npm ci

COPY . .

RUN npm run build --force

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]