/**
 * Test Data Generator Utilities
 * Provides helper functions to generate random test data
 * @module data-generator
 */

/**
 * Generates a random integer between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random integer
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random string of specified length
 * @param length - Desired length of the string
 * @param charset - Character set to use (default: alphanumeric)
 * @returns Random string
 */
export function randomString(
  length: number = 10,
  charset: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * Generates a random email address
 * @param domain - Email domain (default: example.com)
 * @returns Random email address
 */
export function randomEmail(domain: string = "example.com"): string {
  const username = randomString(10, "abcdefghijklmnopqrstuvwxyz");
  return `${username}@${domain}`;
}

/**
 * Generates a random UUID v4
 * @returns Random UUID string
 */
export function randomUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a random boolean value
 * @returns Random boolean
 */
export function randomBoolean(): boolean {
  return Math.random() < 0.5;
}

/**
 * Selects a random element from an array
 * @param array - Array to select from
 * @returns Random element from the array
 */
export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates a random date between start and end dates
 * @param start - Start date
 * @param end - End date
 * @returns Random date
 */
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generates a random phone number
 * @param format - Phone number format (default: US format)
 * @returns Random phone number
 */
export function randomPhoneNumber(format: string = "###-###-####"): string {
  return format.replace(/#/g, () => randomInt(0, 9).toString());
}

/**
 * Generates random user data
 * @returns Random user object
 */
export function generateUser() {
  return {
    id: randomInt(1, 10000),
    username: randomString(8, "abcdefghijklmnopqrstuvwxyz"),
    email: randomEmail(),
    firstName: randomElement(["John", "Jane", "Bob", "Alice", "Charlie", "Diana"]),
    lastName: randomElement(["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia"]),
    age: randomInt(18, 80),
    active: randomBoolean(),
    createdAt: randomDate(new Date(2020, 0, 1), new Date()).toISOString(),
  };
}

/**
 * Generates random post data
 * @returns Random post object
 */
export function generatePost() {
  return {
    id: randomInt(1, 10000),
    title: `Test Post ${randomString(5)}`,
    body: `This is a test post body with random content ${randomString(20)}`,
    userId: randomInt(1, 100),
    tags: [
      randomElement(["testing", "performance", "k6", "automation"]),
      randomElement(["api", "rest", "graphql", "websocket"]),
    ],
    published: randomBoolean(),
    createdAt: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
  };
}

/**
 * Generates random comment data
 * @returns Random comment object
 */
export function generateComment() {
  return {
    id: randomInt(1, 10000),
    postId: randomInt(1, 100),
    name: randomString(15),
    email: randomEmail(),
    body: `Comment body ${randomString(30)}`,
  };
}

/**
 * Generates an array of random data using a generator function
 * @param generator - Generator function
 * @param count - Number of items to generate
 * @returns Array of generated items
 */
export function generateArray<T>(generator: () => T, count: number): T[] {
  return Array.from({ length: count }, generator);
}
