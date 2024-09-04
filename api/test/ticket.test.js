const request = require('./setup');
const mongoose = require('mongoose');
const User = require('../models/User');
const Ticket = require('../models/Ticket');

describe('Ticket API', () => {
  let token;
  let userId;

  before(async () => {
    // Register and login user
    const res = await request.post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });

    const loginRes = await request.post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    token = loginRes.body.token;
    userId = (await User.findOne({ email: 'testuser@example.com' }))._id;
  });

  // Test ticket creation
  it('should create a new ticket', async () => {
    const res = await request.post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Ticket',
        description: 'This is a test ticket.',
        category: 'General',
      });

    res.status.should.equal(201);
    res.body.should.have.property('title').eql('Test Ticket');
    res.body.should.have.property('createdBy').eql(userId.toString());
  });

  // Test retrieving a ticket
  it('should retrieve a ticket', async () => {
    const ticket = await Ticket.findOne({ title: 'Test Ticket' });
    const res = await request.get(`/api/tickets/${ticket._id}`)
      .set('Authorization', `Bearer ${token}`);

    res.status.should.equal(200);
    res.body.should.have.property('title').eql('Test Ticket');
  });
});
