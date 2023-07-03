'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const userSchema = require('./users.js');

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DATABASE_URL;

const DATABASE_CONFIG = process.env.NODE_ENV === 'production' ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
} : {};

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);

module.exports = {
  db: sequelize,
  users: userSchema(sequelize, DataTypes),
};

/*This updated code exports the database connection and the user schema for the authentication module. Here's how it works:

1. The `dotenv` package is required to load environment variables from a `.env` file.
2. The `Sequelize` and `DataTypes` objects are imported from the `sequelize` package to create the Sequelize instance and define data types for the user schema.
3. The `userSchema` function is required from the `users.js` file. This function returns the user model schema.
4. The `DATABASE_URL` variable is set based on the `NODE_ENV` environment variable. If `NODE_ENV` is set to `'test'`, it uses an in-memory SQLite database (`sqlite::memory`). Otherwise, it uses the `DATABASE_URL` value from the environment variables.
5. The `DATABASE_CONFIG` object is defined to provide additional configuration options for the Sequelize instance. In this case, it sets the `ssl` option to `true` and disables certificate verification for the PostgreSQL database when running in production mode (`NODE_ENV === 'production'`).
6. The Sequelize instance is created using the `DATABASE_URL` and `DATABASE_CONFIG` options.
7. The database connection (`sequelize`) and the user schema (`users`) are exported as properties of an object.

This code sets up the database connection using Sequelize and exports it along with the user schema for the authentication module. The database URL and configuration are determined based on the `NODE_ENV` environment variable. */