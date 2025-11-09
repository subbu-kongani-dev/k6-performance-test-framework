import {
  validateUrl,
  validateThresholds,
  calculatePercentile,
} from "../validator";

describe("validators", () => {
  it("should validate correct URLs", () => {
    expect(validateUrl("https://api.example.com")).toBe(true);
  });

  it("should reject invalid URLs", () => {
    expect(validateUrl("not-a-url")).toBe(false);
  });

  it("should validate correct threshold formats", () => {
    expect(validateThresholds(["p(95)<500", "rate<0.01"])).toBe(true);
  });

  it("should calculate 50th percentile", () => {
    const values = [1, 2, 3, 4, 5];
    const p50 = calculatePercentile(values, 50);
    expect(p50).toBe(3);
  });
});
