# AD Games API

## Project Summary

The AD Games API is a project to demonstrate the skills required to build backend servers in node.js.
It makes use of Express to execute CRUD functionality across a variety of endpoints.

Here, users can explore [game reviews](https://ad-games-api.herokuapp.com/api/reviews) across a variety of [categories](https://ad-games-api.herokuapp.com/api/categories), and can read, post and update comments on the reviews.

### Where is it?

The live hosted version of this api is here:
<https://ad-games-api.herokuapp.com/api>

Alternatively, you may wish to access the app locally...

## Accessing API Locally

### Cloning this repo

In your local environment, navigate to your chosen directory and use the following commands to create a local copy of this repo:

``` git clone https://github.com/alexdevdavis/be-games.git ```

### Changing directory to the new folder

``` cd <Folder path> ```

## Installing Dependencies

AD Games API is built with Node.js and npm, so the following node packages will need to be installed:

### Blanket install
To install all required packages
```
npm install
```
### Breakdown of Package Dependencies

#### Functional Dependencies

- Express:  ```npm i express```
- PostgreSQL:  ```npm i pg```
- PostgreSQL Formatter:  ```npm i pg-format```
- Dotenv: ```npm i dotenv```

#### Development Dependencies

To facilitate Test-Driven Development

- Jest:  ```npm i -D jest```
- Jest-sorted:  ```npm i -D jest-sorted```
- Supertest:  ```npm i -D supertest```

#### Optional install

- Nodemon: ```npm i -D nodemon```
Use Nodemon to send custom http requests with Postman, Insomnia or equivalent software, on ```localhost:9090/api```

## Environment Variables

This repo uses .env.* files to set the value of PGDATABASE depending on seeding context.

To run this API locally, create two files:

- .env.dev with PGDATABASE=nc_games
- .env.test with PGDATABASE=nc_games_test

Find more on the configuration of PGDATABASE in 'connection.js' file.

## Seeding the Database

### Local Development Environment

In order to set up the databases to run locally, run the following script: ```npm run setup-dbs```.

To seed the local database with development data, enter into the CLI: ```npm run seed```

Then, to set the app listening for http requests, ```npm start```

Now you are able to use a browser, or other software to make http requests to the api at <http://localhost:9090/api>. The root endpoint returns a JSON object of all availably endpoints, with examples of any returned data, parametric endpoints or URL query capability. 

## Test-Driven Development

In building this API, I have followed the principles of test-driven development. Using Supertest in conjunction with Jest enables all seeding of test data and listening to be managed within the test file ```./__tests__/games.test.js```.
Therefore, to run the test suite, simply type the following command: ```npm t```.

## Software Requirements

Please note that this project was built with the following versions of Node and Postgres, and these should be considered the minimum required versions:

- Node v.17.6.0
- Postgres v.8.7.3
