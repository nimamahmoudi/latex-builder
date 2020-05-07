FROM node:10

# Reference: https://nodejs.org/fr/docs/guides/nodejs-docker-webapp/

# Create app directory
WORKDIR /usr/src/app

ENV DEBIAN_FRONTEND=noninteractive
# installed required applications
# Update with latest version of pandoc every once in a while: https://github.com/jgm/pandoc/releases/
RUN apt-get update \
    && apt-get install -qy --no-install-recommends tree wget ca-certificates \
    && wget -q https://github.com/jgm/pandoc/releases/download/2.9.2.1/pandoc-2.9.2.1-1-amd64.deb -O pandoc-amd64.deb \
    && dpkg -i pandoc-amd64.deb \
    && rm pandoc-amd64.deb\
    && apt-get -qy remove --purge wget \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*
ENV DEBIAN_FRONTEND=dialog

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

ENV JWTSECRET=${JWTSECRET:-"nJky3Fg9GdfLVyWNZJqpPk7nA5eBnrs5"}
ENV SESSIONSECRET=${SESSIONSECRET:-"cUYV6G25L7Msa64z8P7YLQkCH9U3X6Bu"}
ENV TMPFOLDER=${TMPFOLDER:-"/tmp/"}

CMD [ "bash", "entrypoint.sh" ]
