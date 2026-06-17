const request = require('supertest');

// Mock the app without starting the server
const app = require('../../src/index');

describe('POST /api/auth/login', () => {
  it('returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'test123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('MISSING_FIELDS');
  });

  it('returns 400 when password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('MISSING_FIELDS');
  });

  it('returns 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@example.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('INVALID_CREDENTIALS');
  });

  it('returns token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'demo@example.com', password: 'demo123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
});

describe('POST /api/auth/reset-password', () => {
  it('returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({});
    expect(res.status).toBe(400);
  });

  it('always returns success when email is provided', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email: 'any@example.com' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
