export { };
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OutcomeSchema = new Schema({
    title: String,
    values: Array
});

module.exports = mongoose.model('Outcome', OutcomeSchema);