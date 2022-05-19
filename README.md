# AD Games API

## Project Summary

The AD Games API is a project to demonstrate the skills required to build backend servers in node.js.
It makes use of Express to execute CRUD functionality across a variety of endpoints.

Here, users can explore [game reviews](https://ad-games-api.herokuapp.com/api/reviews) across a variety of [categories](https://ad-games-api.herokuapp.com/api/categories), and can read, post and update comments on the reviews.

## Where is it?

The live hosted version of this api is here:
<https://ad-games-api.herokuapp.com/api>

## Cloning this repo

In your local environment, navigate to your chosen directory and use the following commands to create a local copy of this repo:

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

##
