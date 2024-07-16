# Creating base container, either Ubuntu or Windows
FROM ubuntu

# Install Nodejs 
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - 
RUN apt-get update -y
RUN apt-get install -y nodejs

# Copy files from local machine to container
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY server.js server.js

#First running command
ENTRYPOINT [ "node", "server.js" ]