/**
 * Test Data Fixtures
 * Provides static test data for consistent testing
 * @module test-data
 */

/**
 * Sample user data for testing
 */
export const sampleUsers = [
  {
    id: 1,
    username: "testuser1",
    email: "testuser1@example.com",
    firstName: "John",
    lastName: "Doe",
  },
  {
    id: 2,
    username: "testuser2",
    email: "testuser2@example.com",
    firstName: "Jane",
    lastName: "Smith",
  },
  {
    id: 3,
    username: "testuser3",
    email: "testuser3@example.com",
    firstName: "Bob",
    lastName: "Johnson",
  },
];

/**
 * Sample post data for testing
 */
export const samplePosts = [
  {
    id: 1,
    title: "First Test Post",
    body: "This is the body of the first test post",
    userId: 1,
  },
  {
    id: 2,
    title: "Second Test Post",
    body: "This is the body of the second test post",
    userId: 1,
  },
  {
    id: 3,
    title: "Third Test Post",
    body: "This is the body of the third test post",
    userId: 2,
  },
];

/**
 * Sample comment data for testing
 */
export const sampleComments = [
  {
    id: 1,
    postId: 1,
    name: "Test Comment 1",
    email: "commenter1@example.com",
    body: "This is a test comment",
  },
  {
    id: 2,
    postId: 1,
    name: "Test Comment 2",
    email: "commenter2@example.com",
    body: "This is another test comment",
  },
];

/**
 * Sample authentication tokens for testing
 */
export const sampleTokens = {
  validToken: "valid-test-token-12345",
  expiredToken: "expired-test-token-67890",
  invalidToken: "invalid-token",
};

/**
 * Sample API endpoints for testing
 */
export const testEndpoints = {
  users: "/users",
  posts: "/posts",
  comments: "/comments",
  albums: "/albums",
  photos: "/photos",
  todos: "/todos",
};

/**
 * Common test payloads
 */
export const testPayloads = {
  createUser: {
    username: "newuser",
    email: "newuser@example.com",
    firstName: "New",
    lastName: "User",
  },
  createPost: {
    title: "New Post",
    body: "This is a new post body",
    userId: 1,
  },
  updatePost: {
    title: "Updated Post Title",
    body: "This is the updated post body",
  },
};

/**
 * Expected response schemas for validation
 */
export const responseSchemas = {
  user: {
    id: "number",
    username: "string",
    email: "string",
  },
  post: {
    id: "number",
    title: "string",
    body: "string",
    userId: "number",
  },
  comment: {
    id: "number",
    postId: "number",
    name: "string",
    email: "string",
    body: "string",
  },
};
