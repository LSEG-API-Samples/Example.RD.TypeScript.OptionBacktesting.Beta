export { };

const getTransDates = require('./getTransDates');
const moment = require('moment');

function getAdjFactors(corpEvent: Object, year: number = null, date: string = null, transDay: string = 'first') {

    if (corpEvent['TR.CAEffectiveDate'] === null || Object.keys(corpEvent).length === 0) {
        if (year !== null && date === null) {
            const adjFactor = Array(12).fill(1);
            return adjFactor;
        }
        else if (year === null && date !== null) {
            const adjFactor = 1;
            return adjFactor;
        }
        else {
            console.log('Either Year or exact date needs to be passed to the function');
        };
    }
    else {
        if (year !== null && date === null) {
            const transDays = getTransDates(year, transDay);
            let adjFactors = [];
            for (let i = 1; i <= 12; i++) {
                let expDate = String(year) + '-' + String(i) + '-' + String(transDays[i - 1]);
                expDate = moment(new Date(expDate)).format('YYYY-MM-DD');
                let adjFactor = 1;
                Object.keys(corpEvent).reverse().forEach(function (key) {
                    if (expDate < corpEvent[key]['TR.CAEffectiveDate']) {
                        adjFactor = corpEvent[key]['TR.CAAdjustmentFactor'] * adjFactor
                    };
                });
                adjFactors.push(adjFactor);
            }
            return adjFactors;
        }
        else if (year === null && date !== null) {
            let adjFactor = 1;
            Object.keys(corpEvent).reverse().forEach(function (key) {
                if (date < corpEvent[key]['TR.CAEffectiveDate']) {
                    adjFactor = corpEvent[key]['TR.CAAdjustmentFactor'] * adjFactor;
                };
            });
            return adjFactor;
        }
        else {
            console.log(('Either Year or exact date needs to be passed to the function'));
        };
    };
};

module.exports = getAdjFactors;

// let corpEvents = getCorpEvents('.NDX').then(function (corp: any) {
//     let a = getAdjFactors(corp, 2014)
// })