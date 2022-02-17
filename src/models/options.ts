export { }
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OptionsSchema = new Schema({
    RIC: String,
    OptionType: String,
    Asset: String,
    Strike: Number,
    ExpirationDate: String
});

module.exports = mongoose.model('Options', OptionsSchema);