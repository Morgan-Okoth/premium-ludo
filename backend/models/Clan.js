const mongoose = require('mongoose');
const { Schema } = mongoose;

const clanSchema = new Schema({});
clanSchema.add({ name: String, owner: Schema.Types.ObjectId, members: [Schema.Types.ObjectId] });
module.exports = mongoose.model('Clan', clanSchema);
