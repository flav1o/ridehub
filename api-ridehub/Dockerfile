FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ADD ./knexfile.js /usr/src/app/
ADD ./src ./src/
ADD ./config.js /usr/src/app/

EXPOSE 3000

ADD my-script.sh /usr/local/bin/my-script.sh

RUN chmod 777 /usr/local/bin/my-script.sh

CMD /usr/local/bin/my-script.sh