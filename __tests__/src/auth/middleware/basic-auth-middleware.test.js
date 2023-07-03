'use strict';

process.env.SECRET = "TEST_SECRET";

const base64 = require('base-64');
const middleware = require('../../../../src/auth/middleware/basic.js');
const { db, users } = require('../../../../src/auth/models/index.js');

let userInfo = {
  admin: { username: 'admin-basic', password: 'password' },
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

  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaW46Zm9v

  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res)
  }
  const next = jest.fn();

  describe('user authentication', () => {

    it('fails a login for a user (admin) with the incorrect basic credentials', () => {
      const basicAuthString = base64.encode('username:password');

      // Change the request to match this test case
      req.headers = {
        authorization: `Basic ${basicAuthString}`,
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(403);
        });

    });

    it('logs in an admin user with the right credentials', () => {
      let basicAuthString = base64.encode(`${userInfo.admin.username}:${userInfo.admin.password}`);

      // Change the request to match this test case
      req.headers = {
        authorization: `Basic ${basicAuthString}`,
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith();
        });

    });
  });
});

/*This code is a unit test suite for testing the authentication middleware functionality in a Node.js application. The middleware is responsible for handling basic authentication using the "Basic" authentication scheme, where the user's credentials are encoded in Base64 and sent as an authorization header in the HTTP request.

Here's a breakdown of the code:

1. **Setting up environment and dependencies**: The code starts by setting up the environment with the `use strict` directive, setting the `SECRET` environment variable, and requiring necessary modules such as `base-64`, the authentication middleware (`basic.js`), and database models (`index.js`).

2. **Mocking user data and database**: The `userInfo` object contains the credentials for an admin user (`admin:password`). It is used to pre-load the database with a fake user before running the tests.

3. **Pre-loading the database**: The `beforeAll` and `afterAll` hooks are used to ensure that the database is synchronized before running the tests and dropped after all tests are done.

4. **Auth Middleware Tests**: The tests are grouped under the "Auth Middleware" describe block.

   - **Test 1**: The first test, "fails a login for a user (admin) with the incorrect basic credentials," simulates a scenario where the user tries to log in with incorrect credentials. The test encodes "username:password" in Base64 and sets the `authorization` header in the `req` object. It then calls the middleware and expects it to respond with a 403 Forbidden status and not call the `next` function.

   - **Test 2**: The second test, "logs in an admin user with the right credentials," simulates a successful login scenario for the admin user with the correct credentials. It encodes the admin's username and password in Base64 and sets the `authorization` header in the `req` object. It calls the middleware and expects it to call the `next` function without any errors.

The tests use Jest's asynchronous testing capabilities with `.then()` to handle asynchronous middleware operations.

Overall, this test suite aims to ensure that the authentication middleware works as expected for both successful and failed login attempts, verifying that it correctly authorizes or rejects users based on the provided credentials.*/