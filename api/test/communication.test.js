const request = require('./setup');
const mongoose = require('mongoose');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Message = require('../models/Message');

describe('Communication API', () => {
  let token;
  let ticketId;

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

    // Create a ticket
    const ticketRes = await request.post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Ticket for Communication',
        description: 'Testing communication feature.',
        category: 'Support',
      });

    ticketId = ticketRes.body._id;
  });

  // Test sending a message
  it('should send a message', async () => {
    const res = await request.post('/api/communications/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ticketId,
        content: 'This is a test message.',
      });

    res.status.should.equal(201);
    res.body.should.have.property('content').eql('This is a test message.');
  });

  // Test retrieving messages
  it('should retrieve messages for a ticket', async () => {
    const res = await request.get(`/api/communications/messages/${ticketId}`)
      .set('Authorization', `Bearer ${token}`);

    res.status.should.equal(200);
    res.body.should.be.an('array');
    res.body[0].should.have.property('content').eql('This is a test message.');
  });
});
