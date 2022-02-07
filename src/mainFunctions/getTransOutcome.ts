export { };

const getOffsetTrans = require('../mainFunctions/getOffsetTrans');
// const getPairTrans = require('../mainFunctions/getPairTransactions');
const getCorpEvents = require('../APIRequests/getCorpEvents');
const getAdjFactors = require('../supplFunctions/getAdjFactors');
const getPrices = require('../APIRequests/getHistPrices');
const getMath = require('../supplFunctions/getMath');
const getIdxs = getMath.getIdxs;

// import { getSession } from '../../src/Common/session';
// const session = getSession();

async function getTransOutcome(optionTrans: any, asset: string, session: any, offset: string = 'yes') {
    // await session.open();
    let noPair = [];
    for (let date of optionTrans.expDate) {
        const idxs = getIdxs(optionTrans.expDate, date);
        if (idxs.length < 2) {
            noPair.push(idxs[0]);
            console.log(`Transation with ${date} expiration date will be removed because of unavailble option pair`);
        };
    };
    for (let key in optionTrans) {
        for (let i = noPair.length - 1; i >= 0; i--) { optionTrans[key].splice(noPair[i], 1) }
    };

    if (offset.toLowerCase() === 'yes') {
        optionTrans = await getOffsetTrans(optionTrans, session)
    };

    let corpEvents = {}
    if (asset[0] != '.') {
        corpEvents = await getCorpEvents(asset, session);
    };

    let closeDate = [];
    let pricesCDate = new Array(optionTrans.RIC.length).fill(0);
    for (let ric of optionTrans.RIC) {
        if (optionTrans.RIC.filter((x: any) => x === ric).length === 1) {
            const idxric = getIdxs(optionTrans.RIC, ric);
            closeDate.push(optionTrans.expDate[idxric[0]]);
        }
        else if (optionTrans.RIC.filter((x: any) => x === ric).length === 2) {
            const idxric = getIdxs(optionTrans.RIC, ric);
            closeDate.push(optionTrans.transDate[idxric[1]]);
        };
    };
    optionTrans['closeDate'] = closeDate;

    const unique = (value: any, index: any, self: any) => { return self.indexOf(value) === index; };
    const closeDateUnique = optionTrans.closeDate.filter(unique);
    for (let date of closeDateUnique) {
        const prices = await getPrices(asset, date, date, session);
        let adjFactor = 1;
        if (asset[0] != '.') {
            adjFactor = await getAdjFactors(corpEvents, null, date);
        };
        const priceAdjusted = prices[0].TRDPRC_1 / adjFactor;
        const idxs = await getIdxs(optionTrans.closeDate, date);

        for (let idx of idxs) {
            pricesCDate[idx] = priceAdjusted;
        };
    };
    optionTrans['pricesCDate'] = pricesCDate;

    const size = optionTrans.RIC.length;
    let contractPrice = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
        if (optionTrans.position[i] === 'short') {
            contractPrice[i] = optionTrans.OptionPrice[i] * 100;
        }
        else if (optionTrans.position[i] === 'long') {
            contractPrice[i] = -optionTrans.OptionPrice[i] * 100;
        };
    };
    optionTrans['contractPrice'] = contractPrice;

    let exerciseOutcome = new Array(size).fill('0');
    for (let i = 0; i < size; i++) {
        if (optionTrans.optionType[i] === 'call' && optionTrans.position[i] === 'long' && optionTrans.strike[i] < optionTrans.pricesCDate[i]) {
            exerciseOutcome[i] = (optionTrans.pricesCDate[i] - optionTrans.strike[i]) * 100;
        }
        else if (optionTrans.optionType[i] === 'call' && optionTrans.position[i] === 'short' && optionTrans.strike[i] < optionTrans.pricesCDate[i]) {
            exerciseOutcome[i] = -(optionTrans.pricesCDate[i] - optionTrans.strike[i]) * 100;
        }
        else if (optionTrans.optionType[i] === 'put' && optionTrans.position[i] === 'long' && optionTrans.strike[i] > optionTrans.pricesCDate[i]) {
            exerciseOutcome[i] = (optionTrans.strike[i] - optionTrans.pricesCDate[i]) * 100;
        }
        else if (optionTrans.optionType[i] === 'put' && optionTrans.position[i] === 'short' && optionTrans.strike[i] > optionTrans.pricesCDate[i]) {
            exerciseOutcome[i] = -(optionTrans.strike[i] - optionTrans.pricesCDate[i]) * 100;
        }
        else {
            exerciseOutcome[i] = 0
        };
    };
    optionTrans['exerciseOutcome'] = exerciseOutcome;

    let totalPandL = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
        totalPandL[i] = optionTrans.contractPrice[i] + optionTrans.exerciseOutcome[i];
    }
    optionTrans['totalPandL'] = totalPandL;

    let outcome = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
        if (optionTrans.optionType[i] === 'call' && optionTrans.position[i] === 'long' && optionTrans.strike[i] < optionTrans.pricesCDate[i]) {
            outcome[i] = 'Exercised option';
        }
        else if (optionTrans.optionType[i] === 'call' && optionTrans.position[i] === 'short' && optionTrans.strike[i] < optionTrans.pricesCDate[i]) {
            outcome[i] = 'Exercised option';
        }
        else if (optionTrans.optionType[i] === 'put' && optionTrans.position[i] === 'long' && optionTrans.strike[i] > optionTrans.pricesCDate[i]) {
            outcome[i] = 'Exercised option';
        }
        else if (optionTrans.optionType[i] === 'put' && optionTrans.position[i] === 'short' && optionTrans.strike[i] > optionTrans.pricesCDate[i]) {
            outcome[i] = 'Exercised option';
        }
        else {
            outcome[i] = 'Expired worthless';
        };
    };
    optionTrans['outcome'] = outcome;

    // await session.close();
    console.log(`${optionTrans.RIC.length} option transactions are conducted`);
    return optionTrans;
};

module.exports = getTransOutcome;

// To run this code from here uncomment session related codes here and from dependency function(s) (getPairTrans)

// getPairTrans(2017, 'first', '.NDX', 10, 20, 2.5, 'short', 'long', session).then((optionTrans: any) => {
//     getTransOutcome(optionTrans, '.NDX', session).then((a: any) => {
//         console.log(a)
//     })
// })
