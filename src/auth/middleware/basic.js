'use strict';

const base64 = require('base-64');
const { users } = require('../models/index.js');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { next ('Invalid Login'); }

  let basic = req.headers.authorization.split(' ').pop();
  let [username, pass] = base64.decode(basic).split(':');

  try {
    req.user = await users.authenticateBasic(username, pass);
    next();
  } catch (e) {
    console.error(e);
    res.status(403).send('Invalid Login');
  }

};

/* This code exports a middleware function that performs basic authentication. Here's how it works:

1. The `base64` module is required to decode the basic authentication credentials.
2. The `users` object from the models is required to access the `authenticateBasic` function, which handles the authentication process.
3. The middleware function receives the `req` (request), `res` (response), and `next` parameters.
4. The function checks if the `Authorization` header exists in the request. If it doesn't, it calls the `next` function with the string `'Invalid Login'` as an argument, indicating that authentication failed.
5. If the `Authorization` header exists, the function extracts the base64-encoded credentials from the header and decodes them.
6. The decoded credentials are split into `username` and `pass` (password) using the colon `:` as the delimiter.
7. The function attempts to authenticate the user by calling the `authenticateBasic` function from the `users` model with the `username` and `pass` as arguments.
8. If authentication is successful, the user object is assigned to `req.user`, and the function calls `next` to pass control to the next middleware or route handler.
9. If authentication fails (an error is thrown), the function logs the error and sends a response with a status code of 403 (Forbidden) and the message `'Invalid Login'`.

This middleware can be used to protect routes that require basic authentication. It decodes the credentials, verifies them against the user data in the database, and grants access to the route if the authentication is successful. Otherwise, it returns a 403 status code and an error message. */