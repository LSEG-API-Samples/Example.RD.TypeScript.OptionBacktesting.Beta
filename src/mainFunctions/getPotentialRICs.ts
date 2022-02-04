export { };

const moment = require('moment');
const getTransDates = require('../supplFunctions/getTransDates');
const getExpDates = require('../supplFunctions/getExpDates');
const getCorpEvents = require('../APIRequests/getCorpEvents');
const getAdjFactors = require('../supplFunctions/getAdjFactors');
const getPrices = require('../APIRequests/getHistPrices');

// import { getSession } from '../../src/Common/session';
// const session = getSession();

async function getPotentialRICs(year: number, transDay: string, asset: string, OTMSize: number, diff: number, optType: string, session: any) {
    // await session.open();

    const transDays = getTransDates(year, transDay);
    const transDaysPrevious = getTransDates(year - 1, transDay);
    const dates = getExpDates(year);
    const exp = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    let potentialRICs = {};
    let strikes = {};
    let assetName = null;
    let adjFactors: number[] = [];

    if (asset[0] == '.') {
        assetName = asset.split('.', 2)[1];
    }
    else {
        assetName = asset.split('.', 2)[0];
        const corpEvents = await getCorpEvents(asset, session);
        adjFactors = getAdjFactors(corpEvents, year);
    };

    const expCodesCall = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
    const expCodesPut = ['m', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x'];
    const promises = [];

    for (let i = 1; i <= 12; i++) {
        const day = dates[i - 1];
        let date = null;
        if (i !== 1) {
            date = `${year}-${i - 1}-${transDays[i - 2]}`;
        }
        else if (i === 1) {
            date = `${year - 1}-${i + 11}-${transDaysPrevious[i + 10]}`;
        }
        date = moment(new Date(date)).format('YYYY-MM-DD');

        promises.push(
            (async () => {
                const prices = await getPrices(asset, date, date, session)
                let adjFactor = 1;
                if (asset[0] != '.') {
                    adjFactor = adjFactors[i - 1];
                }
                const priceAdjusted = prices[0].TRDPRC_1 / adjFactor;
                let strike = null;
                let expMonth = null;

                if (optType.toLowerCase() === 'call') {
                    strike = priceAdjusted + priceAdjusted * OTMSize / 100;
                    if (strike > 999.999) {
                        expMonth = expCodesCall[i - 1];
                    }
                    else {
                        expMonth = expCodesCall[i - 1].toUpperCase();
                    };
                }
                else if (optType.toLowerCase() === 'put') {
                    strike = priceAdjusted - priceAdjusted * OTMSize / 100;
                    if (strike > 999.999) {
                        expMonth = expCodesPut[i - 1];
                    }
                    else {
                        expMonth = expCodesPut[i - 1].toUpperCase();
                    };
                };

                if (strikes.hasOwnProperty(i)) {
                    strikes[i].push(Math.round(strike));
                }
                else {
                    strikes[i] = Math.round(strike);
                };

                let strikeUB = null;
                let strikeLB = null;
                let step = null;
                if (strike > 999.999) {
                    step = 5;
                    strikeUB = Math.round((strike + strike * diff / 100) / 10) * 10;
                    strikeLB = Math.round((strike - strike * diff / 100) / 10) * 10;
                }
                else {
                    step = 1;
                    strikeUB = Math.floor(strike + strike * diff / 100);
                    strikeLB = Math.floor(strike - strike * diff / 100);
                }

                let ric = null;
                for (let j = strikeLB; j <= strikeUB; j += step) {
                    let ricDecStrike = null;
                    const plcHoldr1 = `${assetName}${expMonth}${day}${String(year).slice(-2)}`;
                    const plcHoldr2 = exp[i - 1] + String(year).slice(-2);

                    if (j < 10) {
                        ric = `${plcHoldr1}00${j}00.U^${plcHoldr2}`;
                        ricDecStrike = `${plcHoldr1}00${j}50.U^${plcHoldr2}`;
                    }
                    else if (j >= 10 && j < 100) {
                        ric = `${plcHoldr1}0${j}00.U^${plcHoldr2}`;
                        ricDecStrike = `${plcHoldr1}0${j}50.U^${plcHoldr2}`;
                    }
                    else if (j >= 100 && j < 1000) {
                        ric = `${plcHoldr1}${j}00.U^${plcHoldr2}`;
                        ricDecStrike = `${plcHoldr1}${j}50.U^${plcHoldr2}`;
                    }
                    else if (j >= 1000 && j < 10000) {
                        ric = `${plcHoldr1}${j}0.U^${plcHoldr2}`;
                    }
                    else if (j >= 10000 && j < 20000) {
                        ric = `${plcHoldr1}A${String(j).slice(-4)}.U^${plcHoldr2}`;

                    }
                    else if (j >= 20000 && j < 30000) {
                        ric = `${plcHoldr1}B${String(j).slice(-4)}.U^${plcHoldr2}`;
                    }
                    else if (j >= 30000 && j < 40000) {
                        ric = `${plcHoldr1}C${String(j).slice(-4)}.U^${plcHoldr2}`;
                    }
                    else if (j >= 40000 && j < 50000) {
                        ric = `${plcHoldr1}D${String(j).slice(-4)}.U^${plcHoldr2}`;
                    }

                    if (potentialRICs.hasOwnProperty(i)) {
                        potentialRICs[i].push(ric);
                        if (ricDecStrike !== null) {
                            potentialRICs[i].push(ricDecStrike);
                        };
                    }
                    else {
                        potentialRICs[i] = [ric];
                        if (ricDecStrike !== null) {
                            potentialRICs[i].push(ricDecStrike);
                        };
                    };
                };
            })());
    };
    // await session.close();
    return await Promise.all(promises)
        .then(() => {
            console.log(`Potential RICs for ${optType} options for ${asset} with ${OTMSize}% OTM size for ${year} are created`);
            return [potentialRICs, strikes];
        });
};

module.exports = getPotentialRICs;

// To run this code from here uncomment the session related codes

// getPotentialRICs(2015, 'first', '.NDX', 20, 2.5, 'call', session)
//     .then((RICAndStrike: any) => {
//         // const sortedRics = sortOptionRICs(RICAndStrike[0], RICAndStrike[1])
//         console.log(RICAndStrike)
//     })