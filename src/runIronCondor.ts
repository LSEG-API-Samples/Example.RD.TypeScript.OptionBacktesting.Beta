export { };
const getPairTrans = require('./mainFunctions/getPairTransactions');
const getTransOutcome = require('./mainFunctions/getTransOutcome');
const mergeObjects = require('./supplFunctions/mergeObjects');
const fs = require('fs')

import { getSession } from '../src/Common/session';
const session = getSession();

async function shortIC(start: number, end: number, transDay: string, asset: string, sLeg: number, lLeg: number, diff: number, sPos: string, lPos: string, session: any) {
    await session.open()
    let allOptionTrans: any = {
        'RIC': [],
        'transDate': [],
        'expDate': [],
        'optionType': [],
        'position': [],
        'strike': [],
        'transDatePrice': [],
        'OptionPrice': [],
        'OTMSize': [],
        'closeDate': [],
        'pricesCDate': [],
        'contractPrice': [],
        'exerciseOutcome': [],
        'totalPandL': [],
        'outcome': []
    };

    for (let year = start; year <= end; year++) {
        const optionTransLeg1 = await getPairTrans(year, 'first', asset, sLeg, lLeg, diff, sPos, lPos, session);
        const outcomeLeg1 = await getTransOutcome(optionTransLeg1, asset, session);

        const optionTransLeg2 = await getPairTrans(year, 'first', asset, lLeg, sLeg, diff, lPos, sPos, session);
        const outcomeLeg2 = await getTransOutcome(optionTransLeg2, asset, session);

        const optionTrans = mergeObjects(outcomeLeg1, outcomeLeg2);
        allOptionTrans = mergeObjects(allOptionTrans, optionTrans);

        fs.writeFile(`Output_${year}.txt`, JSON.stringify(allOptionTrans), (err: any) => {
            if (err) throw err;
        });
    };

    await session.close();
    return allOptionTrans
};

shortIC(2015, 2021, 'first', 'AAPL.O', 10, 20, 5, 'short', 'long', session).then((a) => {
    console.log(a);
})
