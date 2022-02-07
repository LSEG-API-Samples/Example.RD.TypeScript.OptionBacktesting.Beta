export { };
const getPairTrans = require('./mainFunctions/getPairTransactions');
const getTransOutcome = require('./mainFunctions/getTransOutcome');
const removeTrans = require('./supplFunctions/removeTrans');
const mergeObjects = require('./supplFunctions/mergeObjects');
const getMath = require('./supplFunctions/getMath');
const getIdxs = getMath.getIdxs;
const fs = require('fs')

import { getSession } from '../src/Common/session';
const session = getSession();

async function shortIC(start: number, end: number, transDay: string, asset: string, sLeg: number, lLeg: number, diff: number, sPos: string, lPos: string, session: any, offset: string) {
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
        const optionTransLeg1 = await getPairTrans(year, transDay, asset, sLeg, lLeg, diff, sPos, lPos, session);
        const outcomeLeg1 = await getTransOutcome(optionTransLeg1, asset, session, offset);

        const optionTransLeg2 = await getPairTrans(year, transDay, asset, lLeg, sLeg, diff, lPos, sPos, session);
        const outcomeLeg2 = await getTransOutcome(optionTransLeg2, asset, session, offset);

        const optionTrans = mergeObjects(outcomeLeg1, outcomeLeg2);
        fs.writeFile(`Output_${year}.txt`, JSON.stringify(optionTrans), (err: any) => {
            if (err) throw err;
        });
        allOptionTrans = mergeObjects(allOptionTrans, optionTrans);
        const endYear = Date.now();
        console.log(`It took around ${Math.round((endYear - startYear) / 1000)} seconds to create transactions for ${year}`)
    };

    fs.writeFile(`Total_OutputPreRem.txt`, JSON.stringify(allOptionTrans), (err: any) => {
        if (err) throw err;
    });

    allOptionTrans = removeTrans(allOptionTrans)

    fs.writeFile(`Total_OutputAftRem.txt`, JSON.stringify(allOptionTrans), (err: any) => {
        if (err) throw err;
    });

    const endTime = Date.now();
    console.log(`It took around ${Math.round((endTime - startTime) / 60000)} minutes to create all transactions for ${asset} for the period of ${start} to ${end}`)

    await session.close();
    return allOptionTrans;
};

shortIC(2015, 2021, 'first', '.SPX', 10, 20, 5, 'short', 'long', session, 'yes').then((allOptionTrans) => {
    console.log(allOptionTrans);
    
    let yearList = [];
    let totalProfit = 0
    for (let element of allOptionTrans.expDate) { element = new Date(element); yearList.push(element.getFullYear()) };
    allOptionTrans['year'] = yearList;

    for (let i = 2015; i <= 2021; i++) {
        let indxYear = getIdxs(allOptionTrans.year, i);
        let profitYear = indxYear.reduce((a: any, b: any) => { return a + allOptionTrans.totalPandL[b] }, 0);
        totalProfit += profitYear;
        console.log(`Total outcome from the strategy during ${i} was equal to ${profitYear}`);
    }
    console.log(`Total outcome for the period 2015 to 2021 was equal to ${totalProfit}`);
});
