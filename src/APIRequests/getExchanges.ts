export { };
import { getSession } from '../Common/session';
import { Search } from '@refinitiv-data/data';

const session = getSession();

async function getExchangeCode(asset:string, openedSession: any = null) {

     const displaySearchResponse = async function (params: Search.Params) {
        const definition = Search.Definition(params);
        const searchRes = await definition.getData(session);
        if (searchRes.data.raw)
            return searchRes.data.raw["Navigators"]["ExchangeCode"];
        else
            console.log('No search result received');
    };

    try {
        if (!openedSession) {
            await session.open();            
            console.log('Session open, sending data request');
        };

        return await displaySearchResponse({
			query: asset,
            filter: "SearchAllCategory eq 'Options' and Periodicity eq 'Monthly' ",
            select: ' RIC, DocumentTitle, UnderlyingQuoteRIC,Periodicity, ExchangeCode',
            navigators: "ExchangeCode",
            top: 10000
		});

    }
    catch (e) {
        console.log(e);
    }
    finally {
        if (!openedSession) { await session.close() }
    };
}

// getExchangeCode('.FTSE').then ((a: any) => {
//     console.log(a)
// })

module.exports = getExchangeCode;