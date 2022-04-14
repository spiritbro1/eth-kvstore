
FROM node:17-alpine

WORKDIR /work
RUN apk update && \
    apk upgrade && \
    apk add git python3-dev build-base libstdc++ gcompat
COPY package.json package-lock.json /work/
RUN npm install

COPY . /work/

CMD ["npm", "run", "deploy"]
