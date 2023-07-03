'use strict'
require('dotenv').config();

const {db} = require('./src/auth/models/index')
const {start} = require('./src/server')

let PORT = process.env.PORT || 5000
db.sync().then(()=> {
    start(PORT)
}).catch(err => console.log(err))

/*This code snippet starts the server by calling the `start` function and specifies the port number to listen on. Here's a breakdown of what it does:

1. Imports the necessary dependencies: `dotenv` for loading environment variables, the database object `db` from the `models` directory, and the `start` function from the `server` module.

2. Loads environment variables from a `.env` file using `dotenv.config()`.

3. Defines the port number to listen on. It checks if a `PORT` environment variable is set, and if not, defaults to port 5000.

4. Calls the `db.sync()` method to synchronize the database schema.

5. Once the database synchronization is complete, it calls the `start` function from the `server` module, passing the port number as an argument.

6. If there is an error during the database synchronization, it is caught and logged to the console.

By executing this code, the server will start listening on the specified port, and the database schema will be synchronized before that. */