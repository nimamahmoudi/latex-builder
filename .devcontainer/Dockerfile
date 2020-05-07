#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

# To fully customize the contents of this image, use the following Dockerfile instead:
# https://github.com/microsoft/vscode-dev-containers/tree/v0.112.0/containers/javascript-node-10/.devcontainer/Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-10

ENV JWTSECRET=${JWTSECRET:-"nJky3Fg9GdfLVyWNZJqpPk7nA5eBnrs5"}
ENV SESSIONSECRET=${SESSIONSECRET:-"cUYV6G25L7Msa64z8P7YLQkCH9U3X6Bu"}
ENV TMPFOLDER=${TMPFOLDER:-"/tmp/"}

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

