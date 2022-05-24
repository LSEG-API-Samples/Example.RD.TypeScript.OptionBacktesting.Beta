export { };
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ricPricesSchema = new Schema({
    asset: String,
    strike: Number,
    maturity: String,
    ric: String,
    optionType: String,
    exchange: String,
    prices: Object,
    createdDate: Date
});

module.exports = mongoose.model('ricPrices', ricPricesSchema);