export { };

import { FundamentalAndReference } from '@refinitiv-data/data';
import { getSession } from '../../src/Common/session';
const session = getSession();
const moment = require('moment');

async function getCorpEvents(asset: string, openedSession: any = null) {

    try {
        if (!openedSession) {
            await session.open();
            console.log('Session open, sending data request');
        };
        let currentDay = moment(new Date(moment())).format('YYYY-MM-DD');
        const fundAndRefDefinition1 = FundamentalAndReference.Definition({
            universe: [asset],
            fields: ["TR.CAEffectiveDate", "TR.CAAdjustmentFactor", "TR.CAAdjustmentType"],
            parameters: { "SDate": currentDay, "EDate": "-50Y" }
        });

        const fundAndRefResponse1 = await fundAndRefDefinition1.getData(openedSession || session);
        return fundAndRefResponse1.data.table;
    }
    catch (e) {
        console.log(e);
    }
    finally {
        if (!openedSession) { await session.close() }
    };
};

// getCorpEvents('AAPL.O').then((a) => {
//     console.log(a)
// })


module.exports = getCorpEvents;