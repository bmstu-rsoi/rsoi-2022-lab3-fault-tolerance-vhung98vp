FROM node:14

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .

EXPOSE 8050

CMD npm start