FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

# Port định tuyến cho ALB Target Group
EXPOSE 3002
ENV PORT=3002

CMD ["node", "src/index.js"]