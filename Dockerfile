# Client
FROM node:14.4.0-alpine as client

WORKDIR /usr/app/client/

COPY client/package*.json ./

RUN npm install -qy

COPY client/ ./

RUN npm run build


# Server
FROM tiangolo/meinheld-gunicorn-flask:python3.8

COPY ./app /app

COPY --from=client /usr/app/client/build/ /app/build/

RUN pip install --upgrade pip && \
    pip install -r /app/requirements.txt