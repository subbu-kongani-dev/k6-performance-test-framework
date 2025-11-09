import { ResponseValidator } from "../response-validator";
import { HttpStatusCode } from "../../constants";

describe("ResponseValidator", () => {
  describe("Status Code Validation", () => {
    it("should return true for 2xx status codes", () => {
      expect(ResponseValidator.isSuccessful(200)).toBe(true);
      expect(ResponseValidator.isSuccessful(201)).toBe(true);
      expect(ResponseValidator.isSuccessful(204)).toBe(true);
    });

    it("should return false for non-2xx status codes", () => {
      expect(ResponseValidator.isSuccessful(400)).toBe(false);
      expect(ResponseValidator.isSuccessful(500)).toBe(false);
    });

    it("should detect client errors (4xx)", () => {
      expect(ResponseValidator.isClientError(400)).toBe(true);
      expect(ResponseValidator.isClientError(404)).toBe(true);
      expect(ResponseValidator.isClientError(200)).toBe(false);
    });

    it("should detect server errors (5xx)", () => {
      expect(ResponseValidator.isServerError(500)).toBe(true);
      expect(ResponseValidator.isServerError(502)).toBe(true);
      expect(ResponseValidator.isServerError(200)).toBe(false);
    });

    it("should validate expected status code", () => {
      expect(ResponseValidator.hasExpectedStatus(200, HttpStatusCode.OK)).toBe(true);
      expect(ResponseValidator.hasExpectedStatus(404, HttpStatusCode.OK)).toBe(false);
    });
  });

  describe("Required Fields Validation", () => {
    it("should validate all required fields are present", () => {
      const data = { id: 1, title: "Test", userId: 1 };
      const result = ResponseValidator.hasRequestFields(data, ["id", "title", "userId"]);
      expect(result.valid).toBe(true);
      expect(result.missing).toEqual([]);
    });

    it("should detect missing required fields", () => {
      const data = { id: 1, title: "Test" };
      const result = ResponseValidator.hasRequiredFields(data, ["id", "title", "userId"]);
      expect(result.valid).toBe(false);
      expect(result.missing).toContain("userId");
    });

    it("should use validateRequiredFields method", () => {
      const data = { id: 1, name: "Test" };
      const result = ResponseValidator.validateRequiredFields(data, ["id", "name"]);
      expect(result.valid).toBe(true);
    });

    it("should detect missing fields with validateRequiredFields", () => {
      const data = { id: 1 };
      const result = ResponseValidator.validateRequiredFields(data, ["id", "name"]);
      expect(result.valid).toBe(false);
    });
  });

  describe("JSON Validation", () => {
    it("should return true for valid JSON strings", () => {
      expect(ResponseValidator.isvalidJson('{"key":"value"}')).toBe(true);
      expect(ResponseValidator.isValidJson('{"key":"value"}')).toBe(true);
    });

    it("should return false for invalid JSON", () => {
      expect(ResponseValidator.isValidJson("{invalid}")).toBe(false);
      expect(ResponseValidator.isvalidJson("")).toBe(false);
    });

    it("should parse JSON safely", () => {
      const result = ResponseValidator.parseJsonSafely('{"name":"John"}');
      expect(result).toEqual({ name: "John" });
    });

    it("should return null for invalid JSON parsing", () => {
      const result = ResponseValidator.parseJsonSafely("{invalid}");
      expect(result).toBeNull();
    });
  });

  describe("Performance Thresholds", () => {
    it("should return true when duration is below threshold", () => {
      expect(ResponseValidator.meetsPerformanceThresholds(450, 500)).toBe(true);
      expect(ResponseValidator.meetsPerformanceThresholds(100, 200)).toBe(true);
    });

    it("should return false when duration exceeds threshold", () => {
      expect(ResponseValidator.meetsPerformanceThresholds(600, 500)).toBe(false);
    });
  });

  describe("Response Body Validation", () => {
    it("should detect non-empty response body", () => {
      expect(ResponseValidator.hasResponseBody("some content")).toBe(true);
      expect(ResponseValidator.hasResponseBody('{"data":"value"}')).toBe(true);
    });

    it("should detect empty response body", () => {
      expect(ResponseValidator.hasResponseBody("")).toBe(false);
      expect(ResponseValidator.hasResponseBody(null)).toBe(false);
      expect(ResponseValidator.hasResponseBody(undefined)).toBe(false);
    });
  });

  describe("Type Validation", () => {
    it("should validate field types", () => {
      const data = { id: 1, name: "John", active: true };
      expect(ResponseValidator.hasExpectedType(data, "id", "number")).toBe(true);
      expect(ResponseValidator.hasExpectedType(data, "name", "string")).toBe(true);
      expect(ResponseValidator.hasExpectedType(data, "active", "boolean")).toBe(true);
    });

    it("should detect type mismatches", () => {
      const data = { id: "1" };
      expect(ResponseValidator.hasExpectedType(data, "id", "number")).toBe(false);
    });

    it("should detect missing fields in type validation", () => {
      const data = { name: "John" };
      expect(ResponseValidator.hasExpectedType(data, "id", "number")).toBe(false);
    });
  });

  describe("Schema Validation", () => {
    it("should validate object against schema", () => {
      const data = { id: 1, name: "John", email: "john@example.com" };
      const schema = {
        id: "number",
        name: "string",
        email: "string",
      };
      const result = ResponseValidator.validateSchema(data, schema);
      expect(result.valid).toBe(true);
    });

    it("should detect schema violations", () => {
      const data = { id: "1", name: "John" };
      const schema = {
        id: "number",
        name: "string",
      };
      const result = ResponseValidator.validateSchema(data, schema);
      expect(result.valid).toBe(false);
    });
  });

  describe("Array Length Validation", () => {
    it("should validate minimum array length", () => {
      const arrayData = [1, 2, 3];
      expect(ResponseValidator.hasMinLength(arrayData, 2)).toBe(true);
    });

    it("should detect arrays below minimum length", () => {
      const arrayData = [1];
      expect(ResponseValidator.hasMinLength(arrayData, 2)).toBe(false);
    });
  });

  describe("Complete Response Validation", () => {
    it("should validate complete successful response", () => {
      const result = ResponseValidator.validateResponse(200, { id: 1, name: "John" }, ["id", "name"], 200);
      expect(result.valid).toBe(true);
    });

    it("should detect failed response status", () => {
      const result = ResponseValidator.validateResponse(500, { error: "Server error" });
      expect(result.valid).toBe(false);
    });

    it("should detect missing required fields", () => {
      const result = ResponseValidator.validateResponse(200, { id: 1 }, ["id", "name"]);
      expect(result.valid).toBe(false);
    });
  });
});
