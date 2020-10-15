# 2d-pack

## Overview

2D bin packing

## How to Use

Download [Docker](https://docs.docker.com/engine/install/) and follow its instructions to install it

Create a local copy of this repository

### Development

Run

    docker-compose -f docker-compose.dev.yml build

After the containers have been built (this may take a few minutes), run

    docker-compose -f docker-compose.dev.yml up

React frontend can be accessed at:

    http://0.0.0.0:8080/

And the backend API at:

    http://0.0.0.0:8080/api/orders

### Production

Run

    docker-compose up -d --build

to view an incredibly underwhelming React webpage listing two fruits and their
respective prices.
Though the apparent result is underwhelming, this data was retrieved through an API call
to our Flask server, which can be accessed at

    http://localhost:5000/api/v1.0/test

The trailing '_/api/v1.0/test_' is simply for looks, and can be tweaked easily
in [api/app.py](api/app.py). The front-end logic for consuming our API is
contained in [client/src/index.js](client/src/index.js). The code contained within
these files simply exists to demonstrate how our front-end might consume our back-end
API.

Finally, to gracefully stop running our local servers, you can run

    docker-compose down

in a separate terminal window or press **control + C**.
