const mongoose = require('mongoose');
const { Schema } = mongoose;

const txSchema = new Schema({});
txSchema.add({ userId: Schema.Types.ObjectId, amount: Number, currency: String, status: String, provider: String });
module.exports = mongoose.model('Transaction', txSchema);
