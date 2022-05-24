export { };
const moment = require('moment');
const checkRIC = require('../findRics/checkRIC');

// import { getSession } from '../Common/session';

// const session = getSession();

async function getOpraRIC(asset: string, maturity: string, strike: number, optType: string, session: any) {
    // await session.open();
    let expDate = moment(new Date(maturity)).format('YYYY-MM-DD');
    let assetName = '';
    let expMonth = '';
    if (asset[0] == '.') {
        assetName = asset.split('.', 2)[1];
    }
    else {
        assetName = asset.split('.', 2)[0];
    };
    const ident = {
        '1': { 'exp': 'A', 'C_bigStrike': 'a', 'C_smallStrike': 'A', 'P_bigStrike': 'm', 'P_smallStrike': 'M' },
        '2': { 'exp': 'B', 'C_bigStrike': 'b', 'C_smallStrike': 'B', 'P_bigStrike': 'n', 'P_smallStrike': 'N' },
        '3': { 'exp': 'C', 'C_bigStrike': 'c', 'C_smallStrike': 'C', 'P_bigStrike': 'o', 'P_smallStrike': 'O' },
        '4': { 'exp': 'D', 'C_bigStrike': 'd', 'C_smallStrike': 'D', 'P_bigStrike': 'p', 'P_smallStrike': 'P' },
        '5': { 'exp': 'E', 'C_bigStrike': 'e', 'C_smallStrike': 'E', 'P_bigStrike': 'q', 'P_smallStrike': 'Q' },
        '6': { 'exp': 'F', 'C_bigStrike': 'f', 'C_smallStrike': 'F', 'P_bigStrike': 'r', 'P_smallStrike': 'R' },
        '7': { 'exp': 'G', 'C_bigStrike': 'g', 'C_smallStrike': 'G', 'P_bigStrike': 's', 'P_smallStrike': 'S' },
        '8': { 'exp': 'H', 'C_bigStrike': 'h', 'C_smallStrike': 'H', 'P_bigStrike': 't', 'P_smallStrike': 'T' },
        '9': { 'exp': 'I', 'C_bigStrike': 'i', 'C_smallStrike': 'I', 'P_bigStrike': 'u', 'P_smallStrike': 'U' },
        '10': { 'exp': 'J', 'C_bigStrike': 'j', 'C_smallStrike': 'J', 'P_bigStrike': 'v', 'P_smallStrike': 'V' },
        '11': { 'exp': 'K', 'C_bigStrike': 'k', 'C_smallStrike': 'K', 'P_bigStrike': 'w', 'P_smallStrike': 'W' },
        '12': { 'exp': 'L', 'C_bigStrike': 'l', 'C_smallStrike': 'L', 'P_bigStrike': 'x', 'P_smallStrike': 'X' }
    }
    if (optType.toUpperCase() === 'C') {
        if (strike > 999.999) {
            expMonth = ident[moment(expDate).format('M')].C_bigStrike
        }
        else {
            expMonth = ident[moment(expDate).format('M')].C_smallStrike
        }
    }
    else if (optType.toUpperCase() === 'P') {
        if (strike > 999.999) {
            expMonth = ident[moment(expDate).format('M')].P_bigStrike
        }
        else {
            expMonth = ident[moment(expDate).format('M')].P_smallStrike
        }
    }
    let intPart = null;
    let decPart = null;
    let strikeRIC = '';

    if (strike % 1 !== 0) {
        intPart = Math.floor(strike);
        decPart = String(strike).split('.', 2)[1]
    }
    else {
        intPart = Math.floor(strike)
        decPart = '00'
    }
    if (decPart.length === 1) {
        decPart = `${decPart}'0'`
    }

    if (intPart < 10) {
        strikeRIC = `00${String(intPart)}${decPart}`
    }
    else if (intPart >= 10 && intPart < 100) {
        strikeRIC = `0${String(intPart)}${decPart}`
    }
    else if (intPart >= 100 && intPart < 1000) {
        strikeRIC = `${String(intPart)}${decPart}`
    }
    else if (intPart >= 1000 && intPart < 10000) {
        strikeRIC = `${String(intPart)}0`
    }
    else if (intPart >= 10000 && intPart < 20000) {
        strikeRIC = `A${String(intPart).slice(-4)}`
    }
    else if (intPart >= 20000 && intPart < 30000) {
        strikeRIC = `B${String(intPart).slice(-4)}`
    }
    else if (intPart >= 30000 && intPart < 40000) {
        strikeRIC = `C${String(intPart).slice(-4)}`
    }
    else if (intPart >= 40000 && intPart < 50000) {
        strikeRIC = `D${String(intPart).slice(-4)}`
    }
    const ric = `${assetName}${expMonth}${moment(expDate).format('D')}${moment(expDate).format('Y').slice(-2)}${strikeRIC}.U`

    const response = await checkRIC(ric, maturity, ident, session)
    // session.close()
    let possibleRICs = []
    if (Object.keys(response[1]).length !== 0) {
        return response
    }
    else {
        possibleRICs.push(response[0])
        console.log(`Here is a list of possible RICs ${possibleRICs}, however we could not find any prices for those!`)
    }
    // console.log(possibleRICs)
    return possibleRICs

}

module.exports = getOpraRIC;

// getOpraRIC('.SPX', '2022-05-20', 4000, 'C', session).then((a:any) => {
//     console.log(a)
// })