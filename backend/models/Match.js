const mongoose = require('mongoose');
const { Schema } = mongoose;

const matchSchema = new Schema({});
matchSchema.add({ players: [Schema.Types.Mixed], logs: [Schema.Types.Mixed], endedAt: Date });
module.exports = mongoose.model('Match', matchSchema);
