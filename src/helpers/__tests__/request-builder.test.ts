import { RequestBuilder } from "../request-builder";

describe("RequestBuilder validation tests", () => {
  let requestBuilder: RequestBuilder;
  const baseUrl = "https://api.example.com";

  beforeEach(() => {
    requestBuilder = new RequestBuilder(baseUrl);
  });

  describe("URL Building", () => {
    it("Given a base URL, when building a URL without query params, then it should return the correct URL", async () => {
      const endpoint = "/posts";
      const url = requestBuilder.buildUrl(endpoint, {});
      expect(url).toBe("https://api.example.com/posts");
    });

    it("Given a base URL, when building a URL with query params, then it should return the correct URL", () => {
      const params = { userId: "1", limit: "10" };
      const url = requestBuilder.buildUrl("/posts", params);
      expect(url).toBe("https://api.example.com/posts?userId=1&limit=10");
    });

    it("should handle base URL with trailing slash", () => {
      const builder = new RequestBuilder("https://api.example.com/");
      const url = builder.buildUrl("/users");
      expect(url).toBe("https://api.example.com/users");
    });

    it("should handle endpoint without leading slash", () => {
      const url = requestBuilder.buildUrl("users");
      expect(url).toBe("https://api.example.com/users");
    });

    it("should throw error for invalid base URL", () => {
      expect(() => new RequestBuilder("invalid-url")).toThrow("Invalid URL format provided");
    });

    it("should throw error for empty base URL", () => {
      expect(() => new RequestBuilder("")).toThrow("Invalid URL format provided");
    });
  });

  describe("Header Management", () => {
    it("Given a base URL, when setting a custom header, then it should be reflected in the request headers", () => {
      requestBuilder.setHeader("Authorization", "Bearer token123");
      const headers = requestBuilder.getRequestHeaders();
      expect(headers["Authorization"]).toBe("Bearer token123");
    });

    it("should set multiple headers", () => {
      requestBuilder.setHeader("Authorization", "Bearer token123");
      requestBuilder.setHeader("X-Custom-Header", "custom-value");
      const headers = requestBuilder.getRequestHeaders();
      expect(headers["Authorization"]).toBe("Bearer token123");
      expect(headers["X-Custom-Header"]).toBe("custom-value");
    });

    it("should set Bearer token", () => {
      requestBuilder.setBearerToken("my-token");
      const headers = requestBuilder.getRequestHeaders();
      expect(headers["Authorization"]).toBe("Bearer my-token");
    });

    it("should set Basic Auth", () => {
      requestBuilder.setBasicAuth("user", "pass");
      const headers = requestBuilder.getRequestHeaders();
      expect(headers["Authorization"]).toContain("Basic");
    });

    it("should set content type", () => {
      requestBuilder.setContentType("application/xml");
      const headers = requestBuilder.getRequestHeaders();
      expect(headers["Content-Type"]).toBe("application/xml");
    });

    it("should remove header", () => {
      requestBuilder.setHeader("X-Remove-Me", "value");
      requestBuilder.removeHeader("X-Remove-Me");
      const headers = requestBuilder.getRequestHeaders();
      expect(headers["X-Remove-Me"]).toBeUndefined();
    });

    it("should clear all headers", () => {
      requestBuilder.setHeader("X-Custom", "value");
      requestBuilder.clearHeaders();
      const headers = requestBuilder.getRequestHeaders();
      // clearHeaders resets to default headers (Content-Type and Accept)
      expect(headers["X-Custom"]).toBeUndefined();
      expect(headers["Content-Type"]).toBeDefined();
      expect(headers["Accept"]).toBeDefined();
    });
  });

  describe("Payload Building", () => {
    it("Given the data, when building a payload, then it should return the correct JSON string", () => {
      const data = { title: "Test", userId: 1 };
      const payload = requestBuilder.buildPayload(data);
      expect(payload).toBe('{"title":"Test","userId":1}');
    });

    it("should handle empty payload", () => {
      const payload = requestBuilder.buildPayload({});
      expect(payload).toBe("{}");
    });

    it("should handle nested objects", () => {
      const data = { user: { name: "John", age: 30 } };
      const payload = requestBuilder.buildPayload(data);
      expect(JSON.parse(payload)).toEqual(data);
    });

    it("should handle arrays in payload", () => {
      const data = { items: [1, 2, 3] };
      const payload = requestBuilder.buildPayload(data);
      expect(JSON.parse(payload)).toEqual(data);
    });
  });

  describe("Clone Functionality", () => {
    it("should clone request builder with same base URL", () => {
      const cloned = requestBuilder.clone();
      expect(cloned.buildUrl("/test")).toBe("https://api.example.com/test");
    });

    it("should clone with independent headers", () => {
      requestBuilder.setHeader("X-Original", "value");
      const cloned = requestBuilder.clone();
      cloned.setHeader("X-Cloned", "cloned-value");

      const originalHeaders = requestBuilder.getRequestHeaders();
      const clonedHeaders = cloned.getRequestHeaders();

      expect(originalHeaders["X-Cloned"]).toBeUndefined();
      expect(clonedHeaders["X-Original"]).toBe("value");
    });
  });
});
