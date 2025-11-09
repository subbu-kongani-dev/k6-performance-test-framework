import { RequestBuilder } from "../request-builder";

describe("RequestBuilder validation tests", () => {
  let requestBuilder: RequestBuilder;
  const baseUrl = "https://api.example.com";

  beforeEach(() => {
    requestBuilder = new RequestBuilder(baseUrl);
  });

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

  it("Given a base URL, when setting a custom header, then it should be reflected in the request headers", () => {
    requestBuilder.setHeader("Authorization", "Bearer token123");
    const headers = requestBuilder.getRequestHeaders();
    expect(headers["Authorization"]).toBe("Bearer token123");
  });

  it("Given the data, when building a payload, then it should return the correct JSON string", () => {
    const data = { title: "Test", userId: 1 };
    const payload = requestBuilder.buildPayload(data);
    expect(payload).toBe('{"title":"Test","userId":1}');
  });
});
