'use strict';

process.env.SECRET = "TEST_SECRET";

const { db } = require('../../../../../src/auth/models');
const { handleSignup } = require('../../../../../src/auth/router/handlers.js');

beforeAll(async () => {
  await db.sync();
});
afterAll(async () => {
  await db.drop();
});

describe('testing the Signup Handler', () => {

  const res = {
    send: jest.fn(() => res),
    status: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  const next = jest.fn();

  test('Should respons with a new user if a Username and Password is present on the request', async () => {

    let req = {
      body: {
        username: 'test',
        password: 'test'
      }
    };

    await handleSignup(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.any(Object),
        token: expect.any(String)
      })
    );
  });

  test('Should call the error handler if no body attached to the request the on the request body', async () => {
    let req = {};
    jest.clearAllMocks();

    await handleSignup(req, res, next);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.anything());
  });
});

/*This code is a unit test for the `handleSignup` function, which is a route handler for the "signup" route in an authentication module. The purpose of this test is to ensure that the `handleSignup` function behaves correctly in different scenarios.

Here's an overview of the code:

1. **Setting up environment and dependencies**: The code starts by setting up the environment with the `use strict` directive and setting the `SECRET` environment variable. It then requires the necessary modules, including the `db` object from the authentication models and the `handleSignup` function from the appropriate path.

2. **Database setup and cleanup**: The `beforeAll` and `afterAll` hooks are used to ensure that the database is synchronized before running the tests and dropped after all tests are done.

3. **Route Handler Tests**: The tests are wrapped inside a describe block titled "testing the Signup Handler."

   - **Test 1**: The first test, titled "Should respond with a new user if a Username and Password is present on the request," sets up the necessary request, response, and next function objects. It assigns the `req.body` property with the username and password of the test user. The `handleSignup` function is then called with these objects using the `await` keyword. The expectation is that the response will have a status code of 201 (Created) and that the `res.json` function will be called with an object containing properties like `user` (expecting an object) and `token` (expecting a string).

   - **Test 2**: The second test, titled "Should call the error handler if no body attached to the request," sets up the necessary request, response, and next function objects. The `req` object is left empty, without a `body` property. The `jest.clearAllMocks()` function is called to reset the call history of the mock functions. The `handleSignup` function is then called with these objects using the `await` keyword. The expectation is that none of the response-related functions (`res.status`, `res.json`) will be called, but the `next` function will be called with an argument of any type.

The tests use Jest's assertions and various matchers to verify the expected behavior of the `handleSignup` function.

Overall, these tests aim to ensure that the `handleSignup` function correctly handles scenarios where a username and password are present on the request body and where no body is attached to the request. It checks that the function responds with the appropriate status codes, data structures, and function calls based on the input. */