FROM node:20-bullseye
RUN apt-get update && apt-get install -y git openssh-client && rm -rf /var/lib/apt/lists/*
RUN npm i -g @ionic/cli cordova-res native-run
WORKDIR /app
EXPOSE 8100 35729 5173