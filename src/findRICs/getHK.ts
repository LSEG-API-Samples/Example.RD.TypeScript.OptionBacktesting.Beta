export { };
const moment = require('moment');
const checkRIC = require('../findRics/checkRIC');
const getExpMonth = require('../findRics/getExpMonth');

// import { getSession } from '../Common/session';

// const session = getSession();

async function getHkRIC(asset: string, maturity: string, strike: number, optType: string, session: any) {
    // await session.open();
    let expDate = moment(new Date(maturity)).format('YYYY-MM-DD');
    let assetName = '';
    let strikeRIC = '';
    if (asset[0] == '.') {
        assetName = asset.split('.', 2)[1];
        strikeRIC = String(Math.floor(strike));
    }
    else {
        assetName = asset.split('.', 2)[0];
        strikeRIC = String(Math.floor(strike * 100));
    };

    const expDetails = getExpMonth(expDate, optType);
    let possibleRICs: any = [];
    if (asset[0] == '.') {
        const ric = `${assetName}${strikeRIC}${expDetails[1]}${moment(expDate).format('Y').slice(-1)}.HF`
        const response = await checkRIC(ric, maturity, expDetails[0], session);
        if (Object.keys(response[1]).length !== 0) {
            // session.close()
            return response
        }
        else {
            possibleRICs.push(response[0])
        }
    }
    else {
        for (let i = 0; i <= 3; i++) {
            const ric = `${assetName}${strikeRIC}${String(i)}${expDetails[1]}${moment(expDate).format('Y').slice(-1)}.HK`
            const response = await checkRIC(ric, maturity, expDetails[0], session);

            if (Object.keys(response[1]).length !== 0) {
                // session.close()
                return response
            }
            else {
                possibleRICs.push(response[0])
            };
        };

    };
    console.log(`Here is a list of possible RICs ${possibleRICs}, however we could not find any prices for those!`)
    // session.close()
    return possibleRICs
}

module.exports = getHkRIC;
// getHkRIC('1093.HK', '2022-03-30', 10, 'C', session).then((a:any) => {
//     console.log(a)
// })