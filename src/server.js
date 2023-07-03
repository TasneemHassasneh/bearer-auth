'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
// const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const authRoutes = require('./auth/router/index.js');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
// app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRoutes);

// Catchalls
app.use(errorHandler);
app.get('/',homehandler)
function homehandler(req,res){
  res.status(200).json({
    message:"home page"
  })
}
app.use(notFound);

function start(port) {
  app.listen(port , () => console.log(`up and running on port ${port}`) )
}
module.exports = {
  start,
    app
};

/*The code you provided sets up the main Express application. Here's a breakdown of what it does:

1. Imports the required dependencies and resources: Express, CORS, the error handlers (`errorHandler` and `notFound`), and the authentication routes (`authRoutes`).

2. Creates an instance of the Express application and assigns it to the `app` constant.

3. Sets up middleware for the application:
   - CORS middleware: Enables Cross-Origin Resource Sharing.
   - JSON middleware: Parses incoming JSON requests.
   - URL encoding middleware: Parses URL-encoded requests.

4. Defines the routes for the application:
   - Registers the authentication routes by using `app.use(authRoutes)`. This will make the authentication routes (`/signup`, `/signin`, `/users`, and `/secret`) available in the application.
   - Defines a catch-all route for handling 404 (Not Found) errors by using `app.use(notFound)`. This will be called when no other routes match the requested path.

5. Defines a catch-all error handler for handling 500 (Internal Server Error) errors by using `app.use(errorHandler)`. This will be called when an error is passed to `next()` in any route or middleware.

6. Defines a custom route handler for the root path (`/`) that sends a JSON response with a "message" property set to "home page".

7. Exports an object with two properties:
   - `start`: A function that starts the server and listens on the specified port.
   - `app`: The Express application instance.

Overall, this code sets up the basic configuration for an Express application, including middleware, routes, error handling, and server startup. */