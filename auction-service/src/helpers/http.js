const buildHttpResponse = (statusCode, content) => ({
  statusCode,
  body: JSON.stringify(content)
});

export const ok = (content = {}) => buildHttpResponse(200, content);

export const created = (content = {}) => buildHttpResponse(201, content);
