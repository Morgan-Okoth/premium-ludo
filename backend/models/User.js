const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({});
userSchema.add({ email: String, passwordHash: String, displayName: String, level: Number, xp: Number });
module.exports = mongoose.model('User', userSchema);
