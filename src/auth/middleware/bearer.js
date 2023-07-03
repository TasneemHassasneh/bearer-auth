'use strict';

const { users } = require('../models/index.js');

module.exports = async (req, res, next) => {
  try {

    if (!req.headers.authorization) { next('Invalid Login') }

    const token = req.headers.authorization.split(' ').pop();
    const validUser = await users.authenticateToken(token);

    req.user = validUser;
    req.token = validUser.token;
    next()
  } catch (e) {
    console.error(e);
    res.status(403).send('Invalid Login');
  }
}

/*This updated code exports a middleware function that performs token-based authentication. Here's how it works:

1. The `users` object from the models is required to access the `authenticateToken` function, which handles the authentication process.
2. The middleware function receives the `req` (request), `res` (response), and `next` parameters.
3. The function attempts to authenticate the user by performing the following steps:
   - It checks if the `Authorization` header exists in the request. If it doesn't, it calls the `next` function with the string `'Invalid Login'` as an argument, indicating that authentication failed.
   - If the `Authorization` header exists, the function extracts the token from the header by splitting it at the space character and selecting the last element of the resulting array.
   - It calls the `authenticateToken` function from the `users` model with the extracted token as an argument.
   - If the token is valid and the authentication is successful, the `validUser` object containing the authenticated user information is assigned to `req.user`, and the token itself is assigned to `req.token`.
   - Finally, the function calls `next` to pass control to the next middleware or route handler.
4. If authentication fails (an error is thrown), the function logs the error and sends a response with a status code of 403 (Forbidden) and the message `'Invalid Login'`.

This middleware can be used to protect routes that require token-based authentication. It verifies the token sent in the `Authorization` header, checks its validity using the `authenticateToken` function, and grants access to the route if the authentication is successful. Otherwise, it returns a 403 status code and an error message. */