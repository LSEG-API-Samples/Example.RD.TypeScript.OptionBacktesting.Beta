module.exports = function getMovingAverage(prices: any, n: number = 3) {
    let maList = [];

    for (let i = prices.length; i > n - 1; i--) {
        const point = prices.slice((i - n), i);
        const pointAverage = point.reduce(function (a: any, b: any) { return a + b; }, 0) / n;
        maList.push(pointAverage);
    };
    for (let i = n - 1; i > 0; i--) {
        const point = prices.slice(0, i);
        const pointAverage = point.reduce(function (a: any, b: any) { return a + b; }, 0) / i;
        maList.push(pointAverage);
    };

    return maList.reverse();
};