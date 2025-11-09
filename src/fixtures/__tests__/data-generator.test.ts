/**
 * Unit tests for data generator utilities
 */

import {
  randomInt,
  randomString,
  randomEmail,
  randomUUID,
  randomBoolean,
  randomElement,
  randomDate,
  randomPhoneNumber,
  generateUser,
  generatePost,
  generateComment,
  generateArray,
} from "../data-generator";

describe("Data Generator Utilities", () => {
  describe("randomInt", () => {
    it("should generate random integer within range", () => {
      const result = randomInt(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
      expect(Number.isInteger(result)).toBe(true);
    });

    it("should handle single value range", () => {
      const result = randomInt(5, 5);
      expect(result).toBe(5);
    });
  });

  describe("randomString", () => {
    it("should generate string of specified length", () => {
      const result = randomString(15);
      expect(result).toHaveLength(15);
    });

    it("should generate string with custom charset", () => {
      const result = randomString(10, "abc");
      expect(result).toHaveLength(10);
      expect(/^[abc]+$/.test(result)).toBe(true);
    });

    it("should generate different strings on multiple calls", () => {
      const str1 = randomString(20);
      const str2 = randomString(20);
      expect(str1).not.toBe(str2);
    });
  });

  describe("randomEmail", () => {
    it("should generate valid email format", () => {
      const result = randomEmail();
      expect(result).toMatch(/^[a-z]+@example\.com$/);
    });

    it("should use custom domain", () => {
      const result = randomEmail("test.com");
      expect(result).toMatch(/^[a-z]+@test\.com$/);
    });
  });

  describe("randomUUID", () => {
    it("should generate valid UUID v4 format", () => {
      const result = randomUUID();
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
      );
    });

    it("should generate unique UUIDs", () => {
      const uuid1 = randomUUID();
      const uuid2 = randomUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe("randomBoolean", () => {
    it("should return boolean value", () => {
      const result = randomBoolean();
      expect(typeof result).toBe("boolean");
    });

    it("should return both true and false eventually", () => {
      const results = new Set();
      for (let i = 0; i < 100; i++) {
        results.add(randomBoolean());
        if (results.size === 2) break;
      }
      expect(results.size).toBe(2);
    });
  });

  describe("randomElement", () => {
    it("should select element from array", () => {
      const array = ["a", "b", "c", "d"];
      const result = randomElement(array);
      expect(array).toContain(result);
    });

    it("should return single element from single-item array", () => {
      const array = ["only"];
      const result = randomElement(array);
      expect(result).toBe("only");
    });
  });

  describe("randomDate", () => {
    it("should generate date within range", () => {
      const start = new Date(2020, 0, 1);
      const end = new Date(2023, 11, 31);
      const result = randomDate(start, end);
      expect(result.getTime()).toBeGreaterThanOrEqual(start.getTime());
      expect(result.getTime()).toBeLessThanOrEqual(end.getTime());
    });
  });

  describe("randomPhoneNumber", () => {
    it("should generate phone number with default format", () => {
      const result = randomPhoneNumber();
      expect(result).toMatch(/^\d{3}-\d{3}-\d{4}$/);
    });

    it("should generate phone number with custom format", () => {
      const result = randomPhoneNumber("(###) ###-####");
      expect(result).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
    });
  });

  describe("generateUser", () => {
    it("should generate valid user object", () => {
      const user = generateUser();
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("firstName");
      expect(user).toHaveProperty("lastName");
      expect(user).toHaveProperty("age");
      expect(user).toHaveProperty("active");
      expect(user).toHaveProperty("createdAt");
    });

    it("should generate user with valid field types", () => {
      const user = generateUser();
      expect(typeof user.id).toBe("number");
      expect(typeof user.username).toBe("string");
      expect(typeof user.email).toBe("string");
      expect(typeof user.age).toBe("number");
      expect(typeof user.active).toBe("boolean");
      expect(user.email).toContain("@");
    });
  });

  describe("generatePost", () => {
    it("should generate valid post object", () => {
      const post = generatePost();
      expect(post).toHaveProperty("id");
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("body");
      expect(post).toHaveProperty("userId");
      expect(post).toHaveProperty("tags");
      expect(post).toHaveProperty("published");
      expect(post).toHaveProperty("createdAt");
    });

    it("should generate post with tags array", () => {
      const post = generatePost();
      expect(Array.isArray(post.tags)).toBe(true);
      expect(post.tags.length).toBeGreaterThan(0);
    });
  });

  describe("generateComment", () => {
    it("should generate valid comment object", () => {
      const comment = generateComment();
      expect(comment).toHaveProperty("id");
      expect(comment).toHaveProperty("postId");
      expect(comment).toHaveProperty("name");
      expect(comment).toHaveProperty("email");
      expect(comment).toHaveProperty("body");
    });
  });

  describe("generateArray", () => {
    it("should generate array of specified count", () => {
      const result = generateArray(generateUser, 5);
      expect(result).toHaveLength(5);
      result.forEach((user) => {
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
      });
    });

    it("should generate empty array for count 0", () => {
      const result = generateArray(generateUser, 0);
      expect(result).toHaveLength(0);
    });
  });
});
