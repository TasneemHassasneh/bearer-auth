'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username }, SECRET);
      },
    },
  });

  model.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  // Basic AUTH: Validating strings (username, password) 
  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({where: { username }});
    const valid = await bcrypt.compare(password, user.password);
    if (valid) { return user; }
    throw new Error('Invalid User');
  };

  // Bearer AUTH: Validating a token
  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, process.env.SECRET);
      const user = await this.findOne({where: { username: parsedToken.username }});
      if (user) { return user; }
      throw new Error('User Not Found');
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return model;
};

module.exports = userSchema;

/*This code defines the user schema for the authentication module. It includes the following features:

1. A Sequelize model for the "User" table with columns for "username" and "password." The "username" must be unique and cannot be null, and the "password" cannot be null as well.

2. A virtual field called "token" that generates a JSON Web Token (JWT) based on the user's username. This token will be available when accessing the "token" property of a user object but will not be stored in the database.

3. A hook (`beforeCreate`) that automatically hashes the user's password before creating the user in the database. It uses `bcrypt` to securely hash the password with a salt factor of 10.

4. Two static methods `authenticateBasic` and `authenticateToken` that handle user authentication. The `authenticateBasic` method takes a username and password as input and verifies them against the stored hashed password. The `authenticateToken` method takes a JWT token as input, verifies it using the `SECRET`, and then retrieves the user based on the decoded username from the token.

5. The `userSchema` function returns the defined model.

This code provides the necessary functionalities to handle user authentication using basic authentication (username/password) and bearer token authentication (JWT). */