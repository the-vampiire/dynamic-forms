const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = mongoose.model('user', user_schema);

module.exports = User;