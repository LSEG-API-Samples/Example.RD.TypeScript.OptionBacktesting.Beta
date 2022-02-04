export { };
import { HistoricalPricing } from '@refinitiv-data/data';
import { getSession } from '../../src/Common/session';

const session = getSession();

async function getPrices(asset: string, sDate: string, eDate: string, openedSession: any = null) {
    try {
        if (!openedSession) {
            await session.open();
            console.log('Session open, sending data request');
        };

        const request = HistoricalPricing.Summaries.Definition({
            universe: asset,
            interval: HistoricalPricing.Summaries.InterdayInterval.DAILY,
            fields: ['TRDPRC_1', 'BID', 'ASK'],
            start: sDate,
            end: eDate
        });
        const historicalPrices = await request.getData(openedSession || session);
        return historicalPrices.data.table;
    }
    catch (e) {
        console.log(e);
    }
    finally {
        if (!openedSession) { await session.close() }
    };
};


// getPrices('NDXk161890000.U^K18', '2018-10-01', '2018-11-16').then((a: any) => {
//     console.log(a)
// })
module.exports = getPrices;