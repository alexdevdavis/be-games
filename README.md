# Northcoders House of Games API

## Cloning this repo

In your local environment, navigate to your chosen directory and use the following command:

``` git clone https://github.com/alexdevdavis/be-games.git ```

## Installing Dependencies

This repo is built with node.js and npm, so the following node packages will need to be installed:

### Functional Dependencies

- Express:  ```npm i express```
- PostgreSQL:  ```npm i pg```
- PostgreSQL Formatter:  ```npm i pg-format```
- Dotenv: ```npm i dotenv```

### Development Dependencies

- Jest:  ```npm i -D jest```
- Jest-sorted:  ```npm i -D jest-sorted```
- Supertest:  ```npm i -D supertest```
- Nodemon: ```npm i -D nodemon``` (optional install for sending custom http requests with Postman, Insomnia or equivalent software)

## Environment Variables

This repo uses .env.* files to set the value of PGDATABASE depending on seeding context.

To run this API locally, create two files:

* .env.dev with PGDATABASE=nc_games
* .env.test with PGDATABASE=nc_games_test

Find more on the configuration of PGDATABASE in 'connection.js' file.
