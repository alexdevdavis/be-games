# Northcoders House of Games API

## Environment Variables

This repo uses .env.* files to set the value of PGDATABASE depending on seeding context.

To run this API locally, create two files:

* .env.dev with PGDATABASE=nc_games
* .env.test with PGDATABASE=nc_games_test

Find more on the configuration of PGDATABASE in 'connection.js' file.
