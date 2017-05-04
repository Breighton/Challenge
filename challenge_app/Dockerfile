FROM node:boron

# create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#install dependencies
COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app

EXPOSE 8080

CMD ["npm", "start"]