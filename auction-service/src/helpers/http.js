const buildHttpResponse = (statusCode, content) => ({
  statusCode,
  body: content ? JSON.stringify(content) : null
});

export const ok = (content = {}) => buildHttpResponse(200, content);

export const created = (content = {}) => buildHttpResponse(201, content);

export const noContent = () => buildHttpResponse(204);
