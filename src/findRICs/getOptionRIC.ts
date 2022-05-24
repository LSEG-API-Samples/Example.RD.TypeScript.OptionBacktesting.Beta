export { };
const getOPRA = require('../findRics/getOPRA');
const getHK = require('../findRics/getHK');
const getOSE = require('../findRics/getOSE');
const getEUREX = require('../findRics/getEUREX');
const getIEU = require('../findRics/getIEU');
const ISINtoRIC = require('../APIRequests/getSymbol');
const getExchangeCode = require('../APIRequests/getExchanges');

// import { getSession } from '../Common/session';

// const session = getSession();

async function getOptionRIC(asset: string, maturity: string, strike: number, optType: string, session: any) {
    // await session.open()
    const exchanges = {
        'OPQ': getOPRA,
        'IEU': getIEU,
        'EUX': getEUREX,
        'HKG': getHK,
        'HFE': getHK,
        'OSA': getOSE
    }

    const exchanges_names = {
        'OPQ': 'OPRA',
        'IEU': 'Intercontinetal Exchange',
        'EUX': 'EUREX',
        'HKG': 'Honk Kong Exchange',
        'HFE': 'Hong Kong Exchange',
        'OSA': 'Osaka Exchange'
    }

    let ric = ''
    if (!asset.includes('.')) {
        ric = await ISINtoRIC(asset)
    }
    else {
        ric = asset
    }

    const exchnageCodes = await getExchangeCode(ric)

    let optionRics = {}
    let pricesList = []
    let possibleRICs = []
    for (let exch in exchnageCodes.Buckets) {
        let exchange = exchnageCodes.Buckets[exch].Label
        if (exchange in exchanges) {
            // console.log(exchanges[exchange])
            const response = await exchanges[exchange](ric, maturity, strike, optType, session)
            if (response[1] && typeof (response[1]) === 'object') {
                optionRics[exchanges_names[exchange]] = (response[0])
                pricesList.push(response[1])
                console.log(`Option RIC for ${exchange} exchange is successfully constructed`)
            }
            else {
                possibleRICs = response
                // return possibleRICs
            }
        }
        else {
            console.log(`The ${exchange} exchange is not supported yet`)
        }
    }
    // session.close()
    return [optionRics, pricesList, possibleRICs]
}

module.exports = getOptionRIC;

// getOptionRIC('.SPX', '2022-02-18', 5000, 'C', session).then((a: any) => {
//     console.log(a)
// })