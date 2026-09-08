FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

# Port định tuyến cho ALB Target Group
EXPOSE 3000
ENV PORT=3000

CMD ["node", "src/index.js"]