export { };

const zip = require('../supplFunctions/zipArray');
// const getPotentialRICs = require('../mainFunctions/getPotentialRICs');

function sortOptionRICs(RICs: Object, strikes: Object) {
    const strikeLetters = ['A', 'B', 'C', 'D'];
    let potentialRICsSorted = {};

    for (let month in RICs) {
        let sort: number[] = [];
        let abs = 0;

        for (const ric of RICs[month]) {
            if (strikeLetters.includes(ric.slice(-11, -10))) {
                abs = Math.abs((parseInt(ric.slice(-10, -6)) - parseInt(String(strikes[month]).slice(-4))));
                sort.push(abs);
            }
            else {
                abs = Math.abs((parseInt(ric.slice(-11, -7)) - parseInt((String(strikes[month]).slice(-4) + '0').slice(0, 4))));
                sort.push(abs);
            };
        };

        const zippedRICs = (zip(RICs[month], sort));
        const sortedArray = zippedRICs.sort(function (a: any, b: any) {
            return a[1] - b[1];
        });

        let arr1: any = [];
        let arr2: any = [];
        sortedArray.map((e: any) => { arr1.push(e[0]); arr2.push(e[1]) });
        if (potentialRICsSorted.hasOwnProperty(month)) {
            potentialRICsSorted[String(month)].push(arr1)
        }
        else {
            potentialRICsSorted[month] = arr1
        };
    };
    return potentialRICsSorted;
};

module.exports = sortOptionRICs;

// getPotentialRICs(2020, 'first', '.NDX', 10, 0.5, 'call')
//     .then((RICAndStrike: any) => {
//         console.log(sortOptionRICs(RICAndStrike[0], RICAndStrike[1]))
//     })