'use strict';

const express = require('express');
const authRouter = express.Router();

const basicAuth = require('../middleware/basic.js');
const bearerAuth = require('../middleware/bearer.js');
const {
  handleSignin,
  handleSignup,
  handleGetUsers,
  handleSecret,
} = require('./handlers.js');

authRouter.post('/signup', handleSignup);
authRouter.post('/signin', basicAuth, handleSignin);
authRouter.get('/users', bearerAuth, handleGetUsers);
authRouter.get('/secret', bearerAuth, handleSecret);

module.exports = authRouter;

/*The code you provided sets up the authentication router using Express. It creates an instance of the `express.Router()` and assigns it to the `authRouter` constant.

The router is configured with the following routes and their corresponding handler functions:

1. POST `/signup`: This route is associated with the `handleSignup` function, which handles user signup requests.

2. POST `/signin`: This route is associated with the `basicAuth` middleware and the `handleSignin` function. The `basicAuth` middleware is responsible for authenticating the user using Basic Authentication. If the authentication is successful, the `handleSignin` function is called to handle the signin request.

3. GET `/users`: This route is associated with the `bearerAuth` middleware and the `handleGetUsers` function. The `bearerAuth` middleware is responsible for authenticating the user using Bearer Authentication. If the authentication is successful, the `handleGetUsers` function is called to retrieve the list of users.

4. GET `/secret`: This route is also associated with the `bearerAuth` middleware and the `handleSecret` function. The `bearerAuth` middleware is used to authenticate the user using Bearer Authentication. If the authentication is successful, the `handleSecret` function is called to handle the request for the secret area.

The configured routes and their corresponding handlers are then exported from the module to be used in the main application file or other modules. */