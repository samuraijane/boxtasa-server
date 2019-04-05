const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  createdAt: {
    default: null,
    type: Date
  },
  password: {
    maxlength: 72,
    minlength: 4,
    required: true,
    trim: true,
    type: String,
  },
  updatedAt: {
    default: null,
    type: Date
  },
  username: {
    maxlength: 12,
    minlength: 4,
    type: String,
    unique: true
  }
});

userSchema.methods.apiRepr = function() {
  return {
    created: this.createdAt,
    id: this._id,
    password: this.password,
    updated: this.updatedAt,
    username: this.username
  };
}

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = {User};
