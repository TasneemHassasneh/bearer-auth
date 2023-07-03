'use strict';

process.env.SECRET = "TEST_SECRET";

const bearer = require('../../../../src/auth/middleware/bearer.js');
const { db, users } = require('../../../../src/auth/models/index.js');
const jwt = require('jsonwebtoken');

let userInfo = {
  admin: { username: 'admin', password: 'password' },
};

// Pre-load our database with fake users
beforeAll(async () => {
  await db.sync();
  await users.create(userInfo.admin);
});
afterAll(async () => {
  await db.drop();
});

describe('Auth Middleware', () => {

  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
    json: jest.fn(() => res),
  }
  const next = jest.fn();

  describe('user authentication', () => {

    it('fails a login for a user (admin) with an incorrect token', () => {

      req.headers = {
        authorization: 'Bearer thisisabadtoken',
      };

      return bearer(req, res, next)
        .then(() => {
          expect(next).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(403);
        });

    });

    it('logs in a user with a proper token', () => {

      const user = { username: 'admin' };
      const token = jwt.sign(user, process.env.SECRET);

      req.headers = {
        authorization: `Bearer ${token}`,
      };

      return bearer(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith();
        });

    });
  });
});

/*This code is another unit test suite, similar to the previous one, but this time it tests the authentication middleware functionality for bearer token authentication. Bearer token authentication involves including a token in the `Authorization` header of the HTTP request.

Let's go through the code:

1. **Setting up environment and dependencies**: The code starts by setting up the environment with the `use strict` directive, setting the `SECRET` environment variable, and requiring necessary modules such as the bearer authentication middleware (`bearer.js`), database models (`index.js`), and the `jsonwebtoken` module.

2. **Mocking user data and database**: The `userInfo` object contains the credentials for an admin user (`admin:password`). It is used to pre-load the database with a fake user before running the tests.

3. **Pre-loading the database**: The `beforeAll` and `afterAll` hooks are used to ensure that the database is synchronized before running the tests and dropped after all tests are done.

4. **Auth Middleware Tests**: The tests are grouped under the "Auth Middleware" describe block.

   - **Test 1**: The first test, "fails a login for a user (admin) with an incorrect token," simulates a scenario where the user tries to log in with an incorrect bearer token. The test sets the `authorization` header in the `req` object with a bad token value. It then calls the bearer middleware and expects it to respond with a 403 Forbidden status and not call the `next` function.

   - **Test 2**: The second test, "logs in a user with a proper token," simulates a successful login scenario for a user with a valid bearer token. It generates a token using the `jsonwebtoken` module by signing the `user` object with the `SECRET` environment variable. The token is then set in the `authorization` header of the `req` object. The bearer middleware is called, and it expects the `next` function to be called without any errors.

The tests use Jest's asynchronous testing capabilities with `.then()` to handle asynchronous middleware operations.

Overall, this test suite aims to ensure that the bearer token authentication middleware correctly verifies and authorizes users based on the provided token. It tests both failed and successful login scenarios, checking that the middleware responds with the expected status codes and calls the `next` function accordingly. */