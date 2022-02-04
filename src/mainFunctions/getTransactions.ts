export { };

const moment = require('moment');
const getTransDates = require('../supplFunctions/getTransDates');
const getExpDates = require('../supplFunctions/getExpDates');
const getCorpEvents = require('../APIRequests/getCorpEvents');
const getAdjFactors = require('../supplFunctions/getAdjFactors');
const getMath = require('../supplFunctions/getMath')
const getSum = getMath.getSum;
const getSpread = getMath.getSpread;
const getPrices = require('../APIRequests/getHistPrices');
// const getPotentialRICs = require('../mainFunctions/getPotentialRICs');
// const sortOptionRICs = require('../supplFunctions/sortOptionRICs');

// import { getSession } from '../../src/Common/session';
// const session = getSession();

async function getTransactions(year: number, transDay: string, asset: string, potentialRICs: Object, optType: string, position: string, session: any) {
    // await session.open();
    const transDays = getTransDates(year, transDay);
    const transDaysPrevious = getTransDates(year - 1, transDay);
    const dates = getExpDates(year);
    const promises = [];
    const tranDetails: any = {
        'RIC': [],
        'transDate': [],
        'expDate': [],
        'optionType': [],
        'position': [],
        'strike': [],
        'transDatePrice': [],
        'OptionPrice': [],
        'OTMSize': []
    };

    let adjFactors: number[] = [];
    if (asset[0] != '.') {
        const corpEvents = await getCorpEvents(asset);
        adjFactors = await getAdjFactors(corpEvents, year);
    };

    for (let month = 1; month <= 12; month++) {
        let sdate: string = null;
        let edate: string = null;
        let sdateReq: string = null;

        edate = moment(new Date(`${year}-${month}-${dates[(month) - 1]}`)).format('YYYY-MM-DD');
        if (month > 2) {
            sdate = moment(new Date(`${year}-${month - 1}-${transDays[month - 2]}`)).format('YYYY-MM-DD');
            sdateReq = moment(new Date(`${year}-${month - 2}-${transDays[(month - 3)]}`)).format('YYYY-MM-DD');
        }
        else if (month === 1) {
            sdate = moment(new Date(`${year - 1}-${month + 11}-${transDaysPrevious[month + 10]}`)).format('YYYY-MM-DD');
            sdateReq = moment(new Date(`${year - 1}-${month + 10}-${transDaysPrevious[transDaysPrevious.length + (month - 4)]}`)).format('YYYY-MM-DD');
        }
        else if (month === 2) {
            sdate = moment(new Date(`${year}-${month - 1}-${transDays[(month - 2)]}`)).format('YYYY-MM-DD');
            sdateReq = moment(new Date(`${year - 1}-${month + 10}-${transDaysPrevious[transDaysPrevious.length + (month - 4)]}`)).format('YYYY-MM-DD');
        }

        let adjFactor = 1;
        if (asset[0] != '.') {
            adjFactor = adjFactors[(month) - 1];
        };

        promises.push(
            (async () => {
                for (let ric of potentialRICs[month]) {
                    const prices = await getPrices(ric, sdateReq, edate, session);
                    let price: number = null;
                    let spread: number = null;
                    let strike: number = null;
                    let OTM: number = null;

                    if (Object.keys(prices).length !== 0) {
                        const pricesSdate: any = Object.values(prices).find(price => price['DATE'] === sdate);

                        if (pricesSdate) {
                            const pricesTrade = pricesSdate?.TRDPRC_1;
                            const pricesAsk = pricesSdate?.ASK;
                            const pricesBid = pricesSdate?.BID;
                            if (pricesTrade !== null) {
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
                            };

                            const priceTrans = await getPrices(asset, sdate, sdate, session);
                            const priceTransAdjusted = priceTrans[0].TRDPRC_1 / adjFactor;
                            tranDetails.transDatePrice.push(priceTransAdjusted);

                            let intPart: number = null;
                            let decPart: number = null;
                            if (priceTransAdjusted < 1000) {
                                intPart = ric.slice(-11, -8);
                                decPart = ric.slice(-8, -6);
                                strike = parseFloat(`${intPart}.${decPart}`);
                            }
                            else if (priceTransAdjusted >= 1000 && priceTransAdjusted < 20000) {
                                if (ric.slice(-11, -10) === 'A') {
                                    strike = parseFloat((ric.slice(-11, -6).replace('A', '1')));
                                }
                                else {
                                    strike = parseFloat(ric.slice(-11, -7));
                                };
                            }
                            else if (priceTransAdjusted >= 20000 && priceTransAdjusted < 30000) {
                                strike = parseFloat(ric.slice(-11, -6).replae('B', '2'));
                            }
                            else if (priceTransAdjusted >= 30000 && priceTransAdjusted < 40000) {
                                strike = parseFloat(ric.slice(-11, -6).replae('C', '2'));
                            }
                            else if (priceTransAdjusted >= 40000 && priceTransAdjusted < 50000) {
                                strike = parseFloat(ric.slice(-11, -6).replae('D', '2'));
                            };

                            // console.log(ric, strike)
                            if (optType.toLocaleLowerCase() === 'call') {
                                OTM = parseFloat(((strike - priceTransAdjusted) / priceTransAdjusted * 100).toFixed(2));
                            }
                            else {
                                OTM = parseFloat(((priceTransAdjusted - strike) / priceTransAdjusted * 100).toFixed(2));
                            };
                            tranDetails.strike.push(strike);
                            tranDetails.OTMSize.push(OTM);
                            tranDetails.OptionPrice.push(parseFloat(price.toFixed(2)));
                            tranDetails.transDate.push(pricesSdate?.DATE);
                            tranDetails.optionType.push(optType.toLowerCase());
                            tranDetails.expDate.push(edate);
                            tranDetails.RIC.push(ric);
                            tranDetails.position.push(position.toLowerCase());

                            break;
                        };
                    };
                };
            })())
    };

    return Promise.all(promises)
        .then(() => {
            console.log(`${tranDetails.RIC.length} ${position} ${optType} transactions for ${year} are registered`);
            // session.close()
            return tranDetails;
        });

};

module.exports = getTransactions;

// To run this code from here uncomment the session related codes

// To run this code from here uncomment session related codes here and from dependency function(s) (getPotentialRICs)

// getPotentialRICs(2018, 'first', '.NDX', 20, 2.5, 'call', session)
//     .then((RICAndStrike: any) => {
//         const sortedRics = sortOptionRICs(RICAndStrike[0], RICAndStrike[1])
//         getTransactions(2018, 'first', '.NDX', sortedRics, 'call', 'short', session).then((transDetails: any) => {
//             console.log(transDetails)
//         })
//     })
