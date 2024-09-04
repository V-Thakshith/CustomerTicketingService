const request = require('./setup');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('Authentication API', () => {
  let token;

  // Test registration
  it('should register a new user', async () => {
    const res = await request.post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });

    res.status.should.equal(201);
    res.body.should.have.property('msg').eql('User registered successfully');
  });

  // Test login
  it('should login the user and return a token', async () => {
    const res = await request.post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    res.status.should.equal(200);
    res.body.should.have.property('token');
    token = res.body.token; // Store the token for later use
  });

  // Test protected route with token
  it('should access protected route', async () => {
    const res = await request.get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    res.status.should.equal(200);
    res.body.should.have.property('email').eql('testuser@example.com');
  });
});
