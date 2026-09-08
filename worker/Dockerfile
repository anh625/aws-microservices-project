FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001
ENV PORT=3001

CMD ["node", "src/index.js"]