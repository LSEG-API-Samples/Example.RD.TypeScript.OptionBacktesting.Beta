export { };
import { getSession } from '../Common/session';
import { SymbolConversion } from '@refinitiv-data/data';

const session = getSession();

async function ISINtoRIC(asset: string, openedSession: any = null) {

    const doSymbolConversion = async function (params: SymbolConversion.Params) {
        const definition = SymbolConversion.Definition(params);
        const convRes = await definition.getData(session);
        if (convRes.data.table)
            return convRes.data.raw.Matches[asset].RIC;
        else
            console.log('No symbol conversion result received');
    };

    try {
        if (!openedSession) {
            await session.open();
            console.log('Session open, sending data request');
        };
        return await doSymbolConversion({

            symbols: [asset],
            fromSymbolType: SymbolConversion.SymbolType.ISIN,
            toSymbolType: SymbolConversion.SymbolType.RIC,
        });

    }
    catch (e) {
        console.log(e);
    }
    finally {
        if (!openedSession) { await session.close() }
    };
}

// ISINtoRIC('JP9010C00002').then((a: any) => {
//     console.log(a)
// })

module.exports = ISINtoRIC;