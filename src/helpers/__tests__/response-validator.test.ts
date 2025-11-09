import { ResponseValidator } from "../response-validator";

describe("ResponseValidator", () => {
  it("should return true for 2xx status codes", () => {
    expect(ResponseValidator.isSuccessful(200)).toBe(true);
    expect(ResponseValidator.isSuccessful(201)).toBe(true);
  });

  it("should return false for non-2xx status codes", () => {
    expect(ResponseValidator.isSuccessful(400)).toBe(false);
    expect(ResponseValidator.isSuccessful(500)).toBe(false);
  });

  it("should validate all required fields are present", () => {
    const data = { id: 1, title: "Test", userId: 1 };
    const result = ResponseValidator.hasRequestFields(data, [
      "id",
      "title",
      "userId",
    ]);
    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it("should return true for valid JSON strings", () => {
    expect(ResponseValidator.isvalidJson('{"key":"value"}')).toBe(true);
  });

  it("should return true when duration is below threshold", () => {
    expect(ResponseValidator.meetsPerformanceThresholds(450, 500)).toBe(true);
  });
});
