export { };
const moment = require('moment');
const getPrices = require('../APIRequests/getHistPrices');

// import { getSession } from '../Common/session';
// const session = getSession();

// const ident = {'1': {'exp': 'A','C': 'A', 'P': 'M'}, 
// '2': {'exp': 'B', 'C': 'B', 'P': 'N'}, 
// '3': {'exp': 'C', 'C': 'C', 'P': 'O'}, 
// '4': {'exp': 'D', 'C': 'D', 'P': 'P'},
// '5': {'exp': 'E', 'C': 'E', 'P': 'Q'},
// '6': {'exp': 'F', 'C': 'F', 'P': 'R'},
// '7': {'exp': 'G', 'C': 'G', 'P': 'S'}, 
// '8': {'exp': 'H', 'C': 'H', 'P': 'T'}, 
// '9': {'exp': 'I', 'C': 'I', 'P': 'U'}, 
// '10': {'exp': 'J', 'C': 'J', 'P': 'V'}, 
// '11': {'exp': 'K', 'C': 'K', 'P': 'W'}, 
// '12': {'exp': 'L', 'C': 'L', 'P': 'X'}}

async function checkRICs(ric: string, maturity: string, ident: any, session: any) {
    // await session.open();
    let expDate = moment(new Date(maturity)).format('YYYY-MM-DD');;
    let sDate = moment().subtract(90, 'days').format('YYYY-MM-DD')
    let eDate = moment().format('YYYY-MM-DD');
    let prices = {};
    if (expDate < moment().format('YYYY-MM-DD')) {
        ric = `${ric}^${ident[moment(expDate).format('M')].exp}${moment(expDate).format('Y').slice(-2)}`
        sDate = moment(expDate).subtract(90, 'days').format('YYYY-MM-DD')
        eDate = moment(expDate).format('YYYY-MM-DD')
    }
    if (ric.split('.')[1].charAt(0) === 'U') {
        prices = await getPrices(ric, sDate, eDate, session);
    }
    else {
        const fields = ['BID', 'ASK', 'TRDPRC_1', 'SETTLE']
        prices = await getPrices(ric, sDate, eDate, session, fields);
    }
    // session.close()
    return [ric, prices]

};

module.exports = checkRICs;

// checkRICs('LFE7000F2.L', '2022-06-30', ident, session).then((a:any) => {
//     console.log(a)
// })