export { };
const getMath = require('./getMath');
const getIdxs = getMath.getIdxs;

module.exports = function removeTrans(optionTrans: any) {
    let noPair: any[] = [];

    for (let i = 0; i < optionTrans.RIC.length; i++) {
        const idxs_trans = getIdxs(optionTrans.transDate, optionTrans.transDate[i]);
        if (idxs_trans.length < 4) {
            const idxs_exp = getIdxs(optionTrans.expDate, optionTrans.expDate[i]);
            for (let idx of idxs_exp) {
                if (!noPair.includes(idx)) {
                    noPair.push(idx);
                }
            };
            console.log(`Transation for ${optionTrans.RIC[i]} with ${optionTrans.transDate[i]} transaction date will be removed because of incomplet iron condor leg`);
        };
    };

    noPair.sort(function (a, b) { return a - b; });
    for (let key in optionTrans) {
        for (let i = noPair.length - 1; i >= 0; i--) { optionTrans[key].splice(noPair[i], 1) }
    };
    return optionTrans;
};
