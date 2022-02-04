export { };

const moment = require('moment');
const getPrices = require('../APIRequests/getHistPrices');
const getMath = require('../supplFunctions/getMath')
const getPercentChange = getMath.getPercentChange;
const getSTDev = getMath.getSTDev;
const getSum = getMath.getSum;
const getSpread = getMath.getSpread;
const getIdxs = getMath.getIdxs;
const getMovingAverage = require('../supplFunctions/getMovingAverage');
const getPairTrans = require('../mainFunctions/getPairTransactions');

// import { getSession } from '../../src/Common/session';
// const session = getSession();

async function getOffsetTrans(optionTrans: any, session: any) {
    // await session.open();
    const promises = [];
    const unique = (value: any, index: any, self: any) => { return self.indexOf(value) === index };
    const transDateUnique = await optionTrans.transDate.filter(unique);

    for (let date of transDateUnique) {
        const transDate = moment(new Date(date)).format('YYYY-MM-DD')
        let sdate = moment(transDate).subtract(1, 'days').format('YYYY-MM-DD');
        const sdateReq = moment(transDate).subtract(30, 'days').format('YYYY-MM-DD');
        const idxs = await getIdxs(optionTrans.transDate, transDate)
        let edate = optionTrans.expDate[idxs[0]]
        const edate1 = moment(optionTrans.expDate[idxs[0]]).subtract(1, 'days').format('YYYY-MM-DD');

        promises.push(
            (async () => {
                const pricesVIX = await getPrices('.VIX', sdateReq, edate1, session);
                const VIXVals = Object.values(pricesVIX);
                let pricesList = [];
                for (let element in pricesVIX) { pricesList.push(pricesVIX[element].TRDPRC_1) };

                const changeVIX = getPercentChange(pricesList.reverse());
                const lenPricesVIX = Object.keys(pricesVIX).length;
                for (let i = 1; i <= lenPricesVIX; i++) { pricesVIX[lenPricesVIX - i]['changeVIX'] = changeVIX[i - 1] };

                const vixMA = getMovingAverage(pricesList);
                for (let i = 1; i <= lenPricesVIX; i++) { pricesVIX[lenPricesVIX - i]['vixMA'] = vixMA[i - 1] };

                const changeMA = getPercentChange(vixMA);
                for (let i = 1; i <= lenPricesVIX; i++) { pricesVIX[lenPricesVIX - i]['changeMA'] = changeMA[i - 1] };

                const eligPrices = VIXVals.filter(price => price['DATE'] < date).map(price => price['changeVIX']);
                const thresh = getSTDev(eligPrices) * 2;
                const eligDays = VIXVals.filter(price => price['DATE'] > date).map(price => price['DATE']).reverse();

                for (let i in eligDays) {
                    if (VIXVals.filter(price => price['DATE'] === eligDays[i]).map(price => price['changeMA'])[0] > thresh) {
                        const vixDate = moment(new Date(eligDays[i])).format('YYYY-MM-DD');
                        sdate = moment(vixDate).subtract(30, 'days').format('YYYY-MM-DD');
                        edate = moment(vixDate).add(1, 'days').format('YYYY-MM-DD');

                        for (let idx of idxs) {
                            const ric = optionTrans.RIC[idx];
                            const prices = await getPrices(ric, sdate, edate, session);

                            let price: number = null;
                            let spread: number = null;
                            const pricesVIXDate = Object.values(prices).filter(price => price['DATE'] === vixDate);
                            const pricesTrade = pricesVIXDate.map(price => price['TRDPRC_1'])[0];
                            const pricesAsk = pricesVIXDate.map(price => price['ASK'])[0];
                            const pricesBid = pricesVIXDate.map(price => price['BID'])[0];

                            if (pricesVIXDate.length && pricesTrade !== null) {
                                price = pricesTrade;
                            }
                            else if (getSum(prices, 'ASK') === 0 && getSum(prices, 'BID') !== 0) {
                                price = pricesBid;
                            }
                            else if (getSum(prices, 'ASK') !== 0 && getSum(prices, 'BID') === 0) {
                                price = pricesAsk;
                            }
                            else if (pricesBid !== null && pricesAsk !== null) {
                                price = (pricesBid + pricesAsk) / 2;
                            }
                            else if (pricesBid === null && pricesAsk !== null) {
                                spread = getSpread(prices)[0];
                                price = pricesAsk - pricesAsk * spread;
                            }
                            else if (pricesBid === null && pricesAsk !== null) {
                                spread = getSpread(prices)[1];
                                price = pricesBid + pricesBid * spread;
                            }
                            else break;

                            optionTrans.RIC.push(ric);
                            optionTrans.transDate.push(vixDate);
                            optionTrans.expDate.push(optionTrans.expDate[idx]);
                            optionTrans.optionType.push(optionTrans.optionType[idx]);
                            optionTrans.strike.push(optionTrans.strike[idx]);
                            optionTrans.transDatePrice.push(null);
                            optionTrans.OptionPrice.push(parseFloat(price.toFixed(2)));
                            optionTrans.OTMSize.push(null);

                            if (optionTrans.position[idx] === 'short') {
                                optionTrans.position.push('long')
                            }
                            else {
                                optionTrans.position.push('short')
                            };
                        };
                        console.log(`Positions for option pair opened on ${date} has been exited through offset transaction`);
                        break;
                    };
                };
            })());
    };

    return Promise.all(promises)
        .then(() => {
            // session.close()
            return optionTrans;
        });
};

module.exports = getOffsetTrans;

// To run this code from here uncomment session related codes here and from dependency function(s) (getPairTrans)

// getPairTrans(2020, 'first', '.NDX', 10, 20, 0.5, 'short', 'long', session).then((optionTrans: any) => {
//     getOffsetTrans(optionTrans, session).then((a) => {
//         console.log(a)
//     })
// })