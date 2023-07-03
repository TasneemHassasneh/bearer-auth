'use strict';

process.env.SECRET = "TEST_SECRET";

const { db, users } = require('../../../../../src/auth/models');
const { handleSignin } = require('../../../../../src/auth/router/handlers.js');

beforeAll(async () => {
  await db.sync();
  await users.create({ username: 'test', password: 'test' });
});
afterAll(async () => {
  await db.drop();
});

describe('Testing the signin handler', () => {

  const res = {
    send: jest.fn(() => res),
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  const next = jest.fn();

  test('Should find a User when a `user` is present on the request', async () => {
    let req = {
      user: await users.findOne({ where: { username: 'test' } }),
    }

    await handleSignin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({
          username: expect.any(String),
          password: expect.any(String),
          token: expect.any(String),
        }),
        token: expect.any(String),
      })
    );
  });

  test('Should trigger error handler when no user is present on the request', async () => {
    let req = {};
    jest.clearAllMocks();

    await handleSignin(req, res, next);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});

/*This code is a unit test for the `handleSignin` function, which is a route handler for the "signin" route in an authentication module. The purpose of this test is to ensure that the `handleSignin` function behaves correctly in different scenarios.

Here's a breakdown of the code:

1. **Setting up environment and dependencies**: The code starts by setting up the environment with the `use strict` directive and setting the `SECRET` environment variable. It then requires the necessary modules, including the `db` and `users` objects from the authentication models and the `handleSignin` function from the appropriate path.

2. **Database setup and cleanup**: The `beforeAll` and `afterAll` hooks are used to ensure that the database is synchronized before running the tests and dropped after all tests are done. In the `beforeAll` hook, a test user is created in the database for the purpose of testing.

3. **Route Handler Tests**: The tests are wrapped inside a describe block titled "Testing the signin handler."

   - **Test 1**: The first test, titled "Should find a User when a `user` is present on the request," sets up the necessary request, response, and next function objects. It assigns the `req.user` property with the test user fetched from the database using `users.findOne()`. The `handleSignin` function is then called with these objects using the `await` keyword, as the function appears to involve asynchronous operations. The expectation is that the response will have a status code of 200 (OK) and that the `res.json` function will be called with an object containing properties like `user`, `username`, `password`, and `token`, all with the expected value types.

   - **Test 2**: The second test, titled "Should trigger error handler when no user is present on the request," sets up the necessary request, response, and next function objects. The `req` object is left empty, without a `user` property. The `jest.clearAllMocks()` function is called to reset the call history of the mock functions. The `handleSignin` function is then called with these objects using the `await` keyword. The expectation is that none of the response-related functions (`res.status`, `res.send`, `res.json`) will be called, but the `next` function will be called.

The tests use Jest's assertions and various matchers to verify the expected behavior of the `handleSignin` function.

Overall, these tests aim to ensure that the `handleSignin` function correctly handles scenarios where a user is present on the request and where no user is present. It checks that the function responds with the appropriate status codes, data structures, and function calls based on the input. */