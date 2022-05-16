# Northcoders House of Games API

## Environment Variables

This repo uses .env.* files to set the value of PGDATABASE depending on seeding context.

To run this API locally, create two files:

* .env.dev with PGDATABASE=NAME_OF_DEVELOPMENT_DATABASE
* .env.test with PGDATABASE=NAME_OF_TEST_DATABASE

Find more on the configuration of PGDATABASE in 'connection.js' file.
