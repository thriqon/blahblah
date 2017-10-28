FROM node:6
COPY package.json /usr/local/src/
RUN cd /usr/local/src && npm install
COPY . /usr/local/src/
RUN cd /usr/local/src && npm test
