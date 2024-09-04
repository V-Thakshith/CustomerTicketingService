const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true }, // Path to the file stored locally
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
});

module.exports = mongoose.model('Attachment', AttachmentSchema);
