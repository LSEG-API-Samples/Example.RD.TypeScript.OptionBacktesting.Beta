module.exports = {
    getSum: function (prices: Object, order: any) {
        let orderPrices: number[] = [];
        Object.values(prices).forEach(element => {
            orderPrices.push(parseFloat(element[order]));
        });
        const sumOrderPrices = orderPrices.reduce(function (a, b) { return a + Number(b); }, 0);
        return sumOrderPrices;
    },
    getMean: function (prices: Object, order: any) {
        let orderPrices: number[] = []
        Object.values(prices).forEach(element => {
            orderPrices.push(element[order]);
        });
        const meanPrices = orderPrices.reduce(function (a, b) { return a + Number(b) / orderPrices.length; }, 0);
        return meanPrices;
    },
    getSpread: function (prices: Object) {
        let spreadRelAsk: number[] = [];
        let spreadRelBid: number[] = [];
        Object.values(prices).forEach(element => {
            if (element.ASK !== null && element.BID !== null) {
                spreadRelAsk.push((element.ASK - element.BID) / element.ASK);
                spreadRelBid.push((element.ASK - element.BID) / element.BID);
            };
        });
        const meanSpreadAsk = spreadRelAsk.reduce(function (a, b) { return a + Number(b) / spreadRelAsk.length; }, 0);
        const meanSpreadBid = spreadRelBid.reduce(function (a, b) { return a + Number(b) / spreadRelBid.length; }, 0)
        return [meanSpreadAsk, meanSpreadBid];
    },
    //https://stackoverflow.com/questions/38092872/calculate-percent-change-over-multiple-dynamic-values-with-javascript
    getPercentChange: function (values: any) {
        const changes = values.map((currVal: any, index: any) => {
            if (index === 0) {
                return;
            };
            const prevVal = values[index - 1];
            if (prevVal === currVal) {
                return '0';
            }
            else {
                return ((currVal - prevVal) / prevVal) * 100;
            };
        }).filter(Boolean);
        changes.unshift(undefined);
        return changes;
    },
    // https://stackoverflow.com/questions/7343890/standard-deviation-javascript
    getSTDev: function (array: any) {
        array = array.map(Number).filter((item: any) => item);
        const n = array.length;
        const mean = array.reduce((a: any, b: any) => a + b) / (n - 1);
        const stDev = Math.sqrt(array.map((x: number) => Math.pow(x - mean, 2)).reduce((a: any, b: any) => a + b) / (n - 1));
        return stDev;
    },
    getIdxs: function (arr: any, value: any) {
        let idxs = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == value) idxs.push(i);
        };
        return idxs
    }
};