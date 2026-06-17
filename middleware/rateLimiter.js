/**
 * RateLimiter — shared rate limiting middleware factory
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.maxRequests - Max requests per window per key
 * @param {Function} [options.keyFn] - Function(req) => string key. Defaults to req.ip
 */
class RateLimiter {
  constructor({ windowMs, maxRequests, keyFn }) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.keyFn = keyFn || ((req) => req.ip);
    this.store = new Map();
  }

  /**
   * Returns Express middleware function
   * @returns {Function} Express middleware (req, res, next) => void
   */
  middleware() {
    return (req, res, next) => {
      const key = this.keyFn(req);
      const now = Date.now();
      const record = this.store.get(key) || { count: 0, resetAt: now + this.windowMs };

      if (now > record.resetAt) {
        record.count = 0;
        record.resetAt = now + this.windowMs;
      }

      record.count++;
      this.store.set(key, record);

      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - record.count));
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetAt / 1000));

      if (record.count > this.maxRequests) {
        const retryAfter = Math.ceil((record.resetAt - now) / 1000);
        res.setHeader('Retry-After', retryAfter);
        return res.status(429).json({
          success: false,
          error: 'RATE_LIMITED',
          message: 'Too many requests. Please try again later.',
          retryAfter
        });
      }

      next();
    };
  }
}

module.exports = { RateLimiter };
