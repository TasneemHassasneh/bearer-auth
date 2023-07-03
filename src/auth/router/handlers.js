'use strict';

const { users } = require('../models/index.js');

async function handleSignup(req, res, next) {
  try {
    let userRecord = await users.create(req.body);
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    res.status(201).json(output);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

async function handleSignin(req, res, next) {
  try {
    const user = {
      user: req.user,
      token: req.user.token,
    };
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

async function handleGetUsers(req, res, next) {
  try {
    const userRecords = await users.findAll({});
    const list = userRecords.map(user => user.username);
    res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
}

function handleSecret(req, res, next) {
  res.status(200).send('Welcome to the secret area!');
}

module.exports = {
  handleSignup,
  handleSignin,
  handleGetUsers,
  handleSecret,
};

/*The code you provided contains four handler functions for different routes:

1. `handleSignup`: This function handles the signup route. It attempts to create a new user record using the `create` method from the `users` model. If successful, it responds with a status of 201 (Created) and sends the user object and the corresponding token in the response body. If an error occurs, it calls the `next` function to pass the error to the error handling middleware.

2. `handleSignin`: This function handles the signin route. It assumes that the authentication middleware has already validated the user and stored the user object in the `req.user` property. It responds with a status of 200 (OK) and sends the user object and the corresponding token in the response body.

3. `handleGetUsers`: This function handles the getUsers route. It retrieves all user records from the database using the `findAll` method from the `users` model. It then extracts the usernames from the user records and sends them as an array in the response body with a status of 200 (OK).

4. `handleSecret`: This function handles the secret route. It simply responds with a status of 200 (OK) and sends the message "Welcome to the secret area!" as the response body.

These handler functions catch any errors that occur during their execution, log the errors to the console, and pass the errors to the error handling middleware by calling `next(e)`.

Overall, these handler functions provide the necessary functionality to handle signup, signin, fetching users, and accessing a secret area in your authentication module.*/