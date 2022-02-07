export { };
const getTransactions = require('../mainFunctions/getTransactions');
const getPotentialRICs = require('../mainFunctions/getPotentialRICs');
const sortOptionRICs = require('../supplFunctions/sortOptionRICs');
const mergeObjects = require('../supplFunctions/mergeObjects');

// import { getSession } from '../../src/Common/session';
// const session = getSession();

async function getPairTrans(year: number, transDay: string, asset: string, callOTM: number, putOTM: number, diff: number, callPos: string, putPos: string, session: any) {
    // await session.open();

    const RICAndStrikeCall = await getPotentialRICs(year, transDay, asset, callOTM, diff, 'call', session);
    const sortedRicsCall = sortOptionRICs(RICAndStrikeCall[0], RICAndStrikeCall[1]);
    const transDetailsCall = await getTransactions(year, transDay, asset, sortedRicsCall, 'call', callPos, session);
    const RICAndStrikePut = await getPotentialRICs(year, transDay, asset, putOTM, diff, 'put', session);
    const sortedRicsPut = sortOptionRICs(RICAndStrikePut[0], RICAndStrikePut[1]);
    const transDetailsPut = await getTransactions(year, transDay, asset, sortedRicsPut, 'put', putPos, session);
    const optionTrans = mergeObjects(transDetailsCall, transDetailsPut);

    // await session.close();
    return optionTrans;
};

module.exports = getPairTrans;

// To run this code from here uncomment session related codes
// getPairTrans(2020, 'first', 'AAPL.O', 10, 20, 0.5, 'short', 'long', session).then((a: any) => {
//     console.log(a)
// })
