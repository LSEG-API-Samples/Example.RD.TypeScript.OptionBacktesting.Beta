export { };
const getPairTrans = require('./mainFunctions/getPairTransactions');
const getTransOutcome = require('./mainFunctions/getTransOutcome');
const removeTrans = require('./supplFunctions/removeTrans');
const mergeObjects = require('./supplFunctions/mergeObjects');
const fs = require('fs')

import { getSession } from '../src/Common/session';
const session = getSession();

async function shortIC(start: number, end: number, transDay: string, asset: string, sLeg: number, lLeg: number, diff: number, sPos: string, lPos: string, session: any) {
    const startTime = Date.now();
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
        const startYear = Date.now();
        const optionTransLeg1 = await getPairTrans(year, 'first', asset, sLeg, lLeg, diff, sPos, lPos, session);
        const outcomeLeg1 = await getTransOutcome(optionTransLeg1, asset, session);

        const optionTransLeg2 = await getPairTrans(year, 'first', asset, lLeg, sLeg, diff, lPos, sPos, session);
        const outcomeLeg2 = await getTransOutcome(optionTransLeg2, asset, session);

        const optionTrans = mergeObjects(outcomeLeg1, outcomeLeg2);
        fs.writeFile(`Output_${year}.txt`, JSON.stringify(optionTrans), (err: any) => {
            if (err) throw err;
        });
        allOptionTrans = mergeObjects(allOptionTrans, optionTrans);
        const endYear = Date.now();
        console.log(`It took ${Math.round((endYear - startYear) / 1000)} seconds to create transactions for ${year}`)
    };

    fs.writeFile(`Total_OutputPreRem.txt`, JSON.stringify(allOptionTrans), (err: any) => {
        if (err) throw err;
    });

    allOptionTrans = removeTrans(allOptionTrans)

    fs.writeFile(`Total_OutputAftRem.txt`, JSON.stringify(allOptionTrans), (err: any) => {
        if (err) throw err;
    });

    await session.close();
    const endTime = Date.now();
    console.log(`It took ${Math.round((endTime - startTime) / 60000)} minutes to create all transactions for ${asset} for the period of ${start} to ${end}`)
    return allOptionTrans;
};

shortIC(2015, 2021, 'first', '.NDX', 10, 20, 2, 'short', 'long', session).then((a) => {
    console.log(a);
});