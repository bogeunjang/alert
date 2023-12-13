const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
  },
  expiration_time: {
    type: String,
  },
  keys: {
    type: Object,
    required: true,
  },
});

exports.User = mongoose.model('User', UserSchema);
