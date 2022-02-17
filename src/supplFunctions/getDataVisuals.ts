export { };
const toJSON = require('../supplFunctions/toJSON');

let optionTrans: any = { "RIC": ["NDXf191549250.U^F15", "NDXd171549300.U^D15", "NDXg171549750.U^G15", "NDXh211548750.U^H15", "NDXb201546500.U^B15", "NDXc201546000.U^C15", "NDXj161545500.U^J15", "NDXe151547500.U^E15", "NDXk201546000.U^K15", "NDXi181550000.U^I15", "NDXo201533500.U^C15", "NDXq151534500.U^E15", "NDXw201533500.U^K15", "NDXt211535500.U^H15", "NDXr191535750.U^F15", "NDXn201533750.U^B15", "NDXs171536250.U^G15", "NDXu181536750.U^I15", "NDXp171535750.U^D15", "NDXv161533250.U^J15", "NDXi181550000.U^I15", "NDXu181536750.U^I15", "NDXj161549750.U^J15", "NDXk201550250.U^K15", "NDXc201550000.U^C15", "NDXb201550000.U^B15", "NDXw201537750.U^K15", "NDXv161537250.U^J15", "NDXo201537750.U^C15", "NDXn201538000.U^B15"], "transDate": ["2015-05-01", "2015-03-02", "2015-06-01", "2015-07-01", "2015-01-02", "2015-02-02", "2015-09-01", "2015-04-01", "2015-10-01", "2015-08-03", "2015-02-02", "2015-04-01", "2015-10-01", "2015-07-01", "2015-05-01", "2015-01-02", "2015-06-01", "2015-08-03", "2015-03-02", "2015-09-01", "2015-08-21", "2015-08-21", "2015-09-01", "2015-10-01", "2015-02-02", "2015-01-02", "2015-10-01", "2015-09-01", "2015-02-02", "2015-01-02"], "expDate": ["2015-06-19", "2015-04-17", "2015-07-17", "2015-08-21", "2015-02-20", "2015-03-20", "2015-10-16", "2015-05-15", "2015-11-20", "2015-09-18", "2015-03-20", "2015-05-15", "2015-11-20", "2015-08-21", "2015-06-19", "2015-02-20", "2015-07-17", "2015-09-18", "2015-04-17", "2015-10-16", "2015-09-18", "2015-09-18", "2015-10-16", "2015-11-20", "2015-03-20", "2015-02-20", "2015-11-20", "2015-10-16", "2015-03-20", "2015-02-20"], "optionType": ["call", "call", "call", "call", "call", "call", "call", "call", "call", "call", "put", "put", "put", "put", "put", "put", "put", "put", "put", "put", "call", "put", "call", "call", "call", "call", "put", "put", "put", "put"], "position": ["short", "short", "short", "short", "short", "short", "short", "short", "short", "short", "long", "long", "long", "long", "long", "long", "long", "long", "long", "long", "long", "short", "long", "long", "long", "long", "short", "short", "short", "short"], "strike": [4925, 4930, 4975, 4875, 4650, 4600, 4550, 4750, 4600, 5000, 3350, 3450, 3350, 3550, 3575, 3375, 3625, 3675, 3575, 3325, 5000, 3675, 4975, 5025, 5000, 5000, 3775, 3725, 3775, 3800], "transDatePrice": [4479.056, 4483.049, 4521.847, 4429.226, 4230.237, 4188.586, 4142.634, 4311.257, 4192.963, 4580.463, 4188.586, 4311.257, 4192.963, 4429.226, 4479.056, 4230.237, 4521.847, 4580.463, 4483.049, 4142.634, null, null, 4142.634, 4192.963, 4188.586, 4230.237, 4192.963, 4142.634, 4188.586, 4230.237], "OptionPrice": [0.15, 0.12, 0.17, 0.55, 1.9, 2, 20.68, 0.47, 8.4, 0.55, 6.25, 2.5, 10.45, 3.9, 2.02, 5.85, 1.92, 2.45, 1.88, 22.9, 1.25, 21.05, 0.3, 0.1, 0.88, 1.17, 54, 61.15, 31.75, 21.07], "OTMSize": [9.96, 9.97, 10.02, 10.06, 9.92, 9.82, 9.83, 10.18, 9.71, 9.16, 20.02, 19.98, 20.1, 19.85, 20.18, 20.22, 19.83, 19.77, 20.26, 19.74, null, null, 20.09, 19.84, 19.37, 18.2, 9.97, 10.08, 9.87, 10.17], "closeDate": ["2015-06-19", "2015-04-17", "2015-07-17", "2015-08-21", "2015-02-20", "2015-03-20", "2015-10-16", "2015-05-15", "2015-11-20", "2015-08-21", "2015-03-20", "2015-05-15", "2015-11-20", "2015-08-21", "2015-06-19", "2015-02-20", "2015-07-17", "2015-08-21", "2015-04-17", "2015-10-16", "2015-08-21", "2015-08-21", "2015-10-16", "2015-11-20", "2015-03-20", "2015-02-20", "2015-11-20", "2015-10-16", "2015-03-20", "2015-02-20"], "pricesCDate": [4513.424, 4351.799, 4661.597, 4197.271, 4443.053, 4458.538, 4438.622, 4494.291, 4686.358, 4197.271, 4458.538, 4494.291, 4686.358, 4197.271, 4513.424, 4443.053, 4661.597, 4197.271, 4351.799, 4438.622, 4197.271, 4197.271, 4438.622, 4686.358, 4458.538, 4443.053, 4686.358, 4438.622, 4458.538, 4443.053], "contractPrice": [15, 12, 17, 55.00000000000001, 190, 200, 2068, 47, 840, 55.00000000000001, -625, -250, -1045, -390, -202, -585, -192, -245.00000000000003, -188, -2290, -125, 2105, -30, -10, -88, -117, 5400, 6115, 3175, 2107], "exerciseOutcome": [0, 0, 0, 0, 0, 0, 0, 0, -8635.800000000017, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "totalPandL": [15, 12, 17, 55.00000000000001, 190, 200, 2068, 47, -7795.8000000000175, 55.00000000000001, -625, -250, -1045, -390, -202, -585, -192, -245.00000000000003, -188, -2290, -125, 2105, -30, -10, -88, -117, 5400, 6115, 3175, 2107], "outcome": ["Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Exercised option", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless", "Expired worthless"] }

// https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
function groupBy(optionTrans: any, key: any) {
    // const JSONoptionTrans = toJSON(optionTrans).values;
    return optionTrans.reduce(function (retVal: any, x: any) {
        (retVal[x[key]] = retVal[x[key]] || []).push(x);
        return retVal
    }, {});
}

module.exports = {
    countTrans: function (optionTrans: any) {
        let all = [];
        let closed: any = [];
        let open: any = [];
        let labels = [];
        const groupedTrans = groupBy(optionTrans, 'year')
        for (let key in groupedTrans) {
            const allTrans = groupedTrans[key].reduce((retVal: any, obj: any) =>
                retVal + +!(obj.OTMSize === null), 0);
            all.push(allTrans / 4)

            const closedTrans = groupedTrans[key].reduce((retVal: any, obj: any) =>
                retVal + +(obj.OTMSize === null), 0);
            closed.push(closedTrans / 4)
            labels.push(key)
        }
        all.map(function (item, index) {
            open.push(item - closed[index]);
        })
        return [labels, open, closed]
    },
    PandLTotal: function (optionTrans: any) {
        let labels = [];
        let PandL = [];
        let PandLCumSum: any = [];
        const groupedTrans = groupBy(optionTrans, 'expDate')
        for (let key in groupedTrans) {
            labels.push(key)
            PandL.push(groupedTrans[key].reduce((total: any, obj: any) => obj.totalPandL + total, 0))
        }
        PandL.reduce(function (a: any, b: any, i: any) { return PandLCumSum[i] = a + b; }, 0);
        return [labels, PandL, PandLCumSum]
    },
    ExerExpOutcome: function (optionTrans: any) {
        let labels = [];
        let PandL = [];
        let contractOutcome = [];
        let exerciseOutcome: any = [];
        const groupedTrans = groupBy(optionTrans, 'year')
        for (let key in groupedTrans) {
            labels.push(key)
            contractOutcome.push(groupedTrans[key].reduce((total: any, obj: any) => obj.contractPrice + total, 0))
            exerciseOutcome.push(groupedTrans[key].reduce((total: any, obj: any) => obj.exerciseOutcome + total, 0))
            PandL.push(groupedTrans[key].reduce((total: any, obj: any) => obj.totalPandL + total, 0))
        }
        return [labels, PandL, contractOutcome, exerciseOutcome]
    },
    ExerExpCountOutcome: function (optionTrans: any) {
        let labels = [];
        let PandL = [];
        let exerciseCount = [];
        let expiredCount: any = [];
        const groupedTrans = groupBy(optionTrans, 'year')
        for (let key in groupedTrans) {
            const expiredTrans = groupedTrans[key].reduce((retVal: any, obj: any) =>
                retVal + +(obj.outcome === "Expired worthless"), 0);
            expiredCount.push(expiredTrans)

            const exercisedTrans = groupedTrans[key].reduce((retVal: any, obj: any) =>
                retVal + +(obj.outcome === "Exercised option"), 0);
            exerciseCount.push(exercisedTrans)
            PandL.push(groupedTrans[key].reduce((total: any, obj: any) => obj.totalPandL + total, 0))
            labels.push(key)
        }
        return [labels, expiredCount, exerciseCount, PandL]
    },
    PandLComponents: function (optionTrans: any) {
        let labels = [];
        let outcomeCompenents: any = {
            "exerciseOutcome": [], "expiredOutcome": [], "callOutcome": [], "putOutcome": [],
            "shortOutcome": [], "longOutcome": [], "longCall": [], "longPut": [], "shortCall": [], "shortPut": []
        }
        let filterValues = ["Exercised option", "Expired worthless", "call", "put", "short", "long",
            ["long", "call"], ["long", "put"], ["short", "call"], ["short", "put"]]
        const groupedTrans = groupBy(optionTrans, 'year')

        for (let key in groupedTrans) {
            let i = -1
            for (let component in outcomeCompenents) {
                i++
                if (i < 2) {
                    const trans = groupedTrans[key].filter((obj: any) => { if (obj.outcome === filterValues[i]) { return obj } });
                    outcomeCompenents[component].push(trans.reduce((total: any, obj: any) => obj.totalPandL + total, 0))
                }
                else if (i >= 2 && i < 4) {
                    const trans = groupedTrans[key].filter((obj: any) => { if (obj.optionType === filterValues[i]) { return obj } });
                    outcomeCompenents[component].push(trans.reduce((total: any, obj: any) => obj.totalPandL + total, 0))
                }
                else if (i >= 4 && i < 6) {
                    const trans = groupedTrans[key].filter((obj: any) => { if (obj.position === filterValues[i]) { return obj } });
                    outcomeCompenents[component].push(trans.reduce((total: any, obj: any) => obj.totalPandL + total, 0))
                }
                else {
                    const trans = groupedTrans[key].filter((obj: any) => { if (obj.position === filterValues[i][0] && obj.optionType === filterValues[i][1]) { return obj } });
                    outcomeCompenents[component].push(trans.reduce((total: any, obj: any) => obj.totalPandL + total, 0))
                }

            }
            labels.push(key)
        }
        return [labels, outcomeCompenents]
    },
    PandLMonthly: function (optionTrans: any) {
        let labels = [];
        let monthlyOutcome: any = {
            "january": [], "february": [], "march": [], "april": [], "may": [], "june": [], "july": [],
            "august": [], "september": [], "october": [], "november": [], "december": []
        }
        const groupedTrans = groupBy(optionTrans, 'year')
        for (let key in groupedTrans) {
            let i = -1;
            for (let month in monthlyOutcome) {
                i++
                const Trans = groupedTrans[key].filter((obj: any) => { if (new Date(obj.expDate).getMonth() === i) { return obj } });
                monthlyOutcome[month].push(Trans.reduce((total: any, obj: any) => obj.totalPandL + total, 0))
            }
            labels.push(key)
        }
        return [labels, monthlyOutcome]
    },
}
