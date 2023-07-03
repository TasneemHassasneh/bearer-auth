'use strict';

process.env.SECRET = "TEST_SECRET";

const { db } = require('../../../../src/auth/models');
const supertest = require('supertest');
const {app} = require('../../../../src/server.js');

const mockRequest = supertest(app);

let userData = {
  testUser: { username: 'user', password: 'password' },
};
let accessToken = null;

beforeAll(async () => {
  await db.sync();
});
afterAll(async () => {
  await db.drop();
});

describe('Auth Router', () => {

  it('Can create a new user', async () => {

    const response = await mockRequest.post('/signup').send(userData.testUser);
    const userObject = response.body;

    expect(response.status).toBe(201);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(userData.testUser.username);
  });

  it('Can signin with basic auth string', async () => {
    let { username, password } = userData.testUser;

    const response = await mockRequest.post('/signin')
      .auth(username, password);

    const userObject = response.body;
    expect(response.status).toBe(200);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(username);
  });

  it('Can signin with bearer auth token', async () => {
    let { username, password } = userData.testUser;

    // First, use basic to login to get a token
    const response = await mockRequest.post('/signin')
      .auth(username, password);

    accessToken = response.body.token;

    // First, use basic to login to get a token
    const bearerResponse = await mockRequest
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);

    // Not checking the value of the response, only that we "got in"
    expect(bearerResponse.status).toBe(200);
  });

  it('basic fails with known user and wrong password ', async () => {

    const response = await mockRequest.post('/signin')
      .auth('admin', 'xyz')
    const { user, token } = response.body;

    expect(response.status).toBe(403);
    expect(response.text).toEqual("Invalid Login");
    expect(user).not.toBeDefined();
    expect(token).not.toBeDefined();
  });

  it('basic fails with unknown user', async () => {

    const response = await mockRequest.post('/signin')
      .auth('nobody', 'xyz')
    const { user, token } = response.body;

    expect(response.status).toBe(403);
    expect(response.text).toEqual("Invalid Login");
    expect(user).not.toBeDefined();
    expect(token).not.toBeDefined();
  });

  it('bearer fails with an invalid token', async () => {

    // First, use basic to login to get a token
    const response = await mockRequest.get('/users')
      .set('Authorization', `Bearer foobar`)
    const userList = response.body;

    // Not checking the value of the response, only that we "got in"
    expect(response.status).toBe(403);
    expect(response.text).toEqual("Invalid Login");
    expect(userList.length).toBeFalsy();
  });

  it('Succeeds with a valid token', async () => {

    const response = await mockRequest.get('/users')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
    expect(response.body).toEqual(expect.anything());
  });

  it('Secret Route fails with invalid token', async () => {
    const response = await mockRequest.get('/secret')
      .set('Authorization', `bearer accessgranted`);

    expect(response.status).toBe(403);
    expect(response.text).toEqual("Invalid Login");
  });
});

/* This code is a comprehensive set of integration tests for the authentication routes in an application. It uses the `supertest` library to make HTTP requests to the application's routes and validate the responses.

Here's an overview of the code:

1. **Setting up environment and dependencies**: The code starts by setting up the environment with the `use strict` directive and setting the `SECRET` environment variable. It then requires the necessary modules, including the `db` object from the authentication models, `supertest`, and the `app` from the server.

2. **Database setup and cleanup**: The `beforeAll` and `afterAll` hooks are used to ensure that the database is synchronized before running the tests and dropped after all tests are done.

3. **Integration Tests**: The tests are wrapped inside a describe block titled "Auth Router."

   - **Test 1**: The first test, titled "Can create a new user," sends a POST request to the `/signup` route with the `userData.testUser` object as the request body. It expects a response with a status code of 201 (Created) and validates that the response body contains a token and the created user's ID and username.

   - **Test 2**: The second test, titled "Can signin with basic auth string," sends a POST request to the `/signin` route with the basic authentication credentials (username and password) in the request headers. It expects a response with a status code of 200 (OK) and validates that the response body contains a token and the user's ID and username.

   - **Test 3**: The third test, titled "Can signin with bearer auth token," first logs in with basic authentication to obtain an access token. It then sends a GET request to the `/users` route with the access token in the request headers. It expects a response with a status code of 200 (OK), indicating successful authentication.

   - **Test 4**: The fourth test, titled "basic fails with known user and wrong password," sends a POST request to the `/signin` route with incorrect basic authentication credentials. It expects a response with a status code of 403 (Forbidden) and validates that the response body does not contain a user object or a token.

   - **Test 5**: The fifth test, titled "basic fails with unknown user," sends a POST request to the `/signin` route with non-existent basic authentication credentials. It expects a response with a status code of 403 (Forbidden) and validates that the response body does not contain a user object or a token.

   - **Test 6**: The sixth test, titled "bearer fails with an invalid token," sends a GET request to the `/users` route with an invalid bearer token. It expects a response with a status code of 403 (Forbidden) and validates that the response body does not contain any user objects.

   - **Test 7**: The seventh test, titled "Succeeds with a valid token," sends a GET request to the `/users` route with a valid bearer token. It expects a response with a status code of 200 (OK) and validates that the response body is not empty.

   - **Test 8**: The eighth test, titled "Secret Route fails with invalid token," sends a GET request to the `/secret` route with an invalid bearer token. It expects a response with a status code of 403 (Forbidden).

These tests cover various authentication scenarios, including creating a new user, signing in with basic authentication, signing in with a bearer token, and accessing protected routes with valid and invalid tokens. They validate the expected status codes, response bodies, and authentication outcomes.

Overall, these integration tests aim to ensure that the authentication routes in the application function correctly and*/