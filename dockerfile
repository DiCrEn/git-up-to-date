# syntax=docker/dockerfile:1

FROM node:16-alpine3.14

WORKDIR /gituptodate

COPY ["dist/.", "./"]
COPY ["docker/git-up-to-date", "/usr/bin"]

RUN chmod +x /usr/bin/git-up-to-date