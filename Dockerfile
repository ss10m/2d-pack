FROM node:14.1.0-alpine as client

WORKDIR /usr/app/client/
COPY client/package*.json ./
RUN npm install -qy
COPY client/ ./
RUN npm run build


# Server
FROM tiangolo/meinheld-gunicorn-flask:python3.7

COPY ./app /app
COPY --from=client /usr/app/client/build/ /app/build/

