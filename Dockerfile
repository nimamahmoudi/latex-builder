FROM node:10

# Reference: https://nodejs.org/fr/docs/guides/nodejs-docker-webapp/

# Create app directory
WORKDIR /usr/src/app

# installed required applications
# Update with latest version of pandoc every once in a while: https://github.com/jgm/pandoc/releases/
RUN apt-get update \
    && apt-get install -qy tree wget ca-certificates \
    && wget -q https://github.com/jgm/pandoc/releases/download/2.9.2.1/pandoc-2.9.2.1-1-amd64.deb -O pandoc-amd64.deb \
    && dpkg -i pandoc-amd64.deb \
    && rm pandoc-amd64.deb\
    && apt-get -qy remove --purge wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

# expose port 3000
EXPOSE 3000

# create tmp folder
RUN mkdir -p tmp

CMD [ "node", "src/app.js" ]
