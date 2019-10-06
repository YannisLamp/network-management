FROM ubuntu:18.04

RUN apt-get update
RUN apt install -y python2.7 python-pip
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt install -y nodejs

EXPOSE 3000

COPY ./distribution-karaf-0.5.4-Boron-SR4/ /usr/src/distribution-karaf-0.5.4-Boron-SR4/

COPY ./net-man-app/public /usr/src/net-man-app/public
COPY ./net-man-app/src /usr/src/net-man-app/src
COPY ./net-man-app/package.json /usr/src/net-man-app/package.json
COPY ./net-man-app/package-lock.json /usr/src/net-man-app/package-lock.json
RUN npm install --prefix /usr/src/net-man-app

ENTRYPOINT ["echo You container is running now."]
COPY ./net-man-backend /usr/src/net-man-backend
COPY ./start_services.sh ./usr/src/start_services.sh

WORKDIR /usr/src/

ENTRYPOINT ["bash", "-c", "./start_services.sh"]

