const { RateLimiter } = require('../../middleware/rateLimiter');
const httpMocks = require('node-mocks-http');

describe('RateLimiter', () => {
  let limiter;

  beforeEach(() => {
    limiter = new RateLimiter({
      windowMs: 60000,
      maxRequests: 3,
      keyFn: (req) => req.ip + req.path
    });
  });

  it('allows requests under the limit', () => {
    const middleware = limiter.middleware();
    const req = httpMocks.createRequest({ ip: '127.0.0.1', path: '/test' });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    middleware(req, res, next);
    middleware(req, res, next);
    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(3);
    expect(res.statusCode).not.toBe(429);
  });

  it('blocks requests over the limit with 429', () => {
    const middleware = limiter.middleware();
    const req = httpMocks.createRequest({ ip: '127.0.0.1', path: '/test' });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Use up the limit
    for (let i = 0; i < 3; i++) {
      middleware(req, httpMocks.createResponse(), next);
    }

    // This one should be rate limited
    middleware(req, res, next);
    expect(res.statusCode).toBe(429);
    expect(res._getJSONData().error).toBe('RATE_LIMITED');
  });

  it('sets Retry-After header when rate limited', () => {
    const middleware = limiter.middleware();
    const req = httpMocks.createRequest({ ip: '1.2.3.4', path: '/rate' });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    for (let i = 0; i < 4; i++) {
      middleware(req, res, next);
    }

    expect(res.getHeader('Retry-After')).toBeDefined();
  });
});
