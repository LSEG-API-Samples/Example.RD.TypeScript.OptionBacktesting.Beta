module.exports = function mergeObjects(obj1: any, obj2: any) {
    let mergedObject = {};

    if (obj1.outcome) {
        mergedObject = {
            RIC: [...obj1.RIC, ...obj2.RIC],
            transDate: [...obj1.transDate, ...obj2.transDate],
            expDate: [...obj1.expDate, ...obj2.expDate],
            optionType: [...obj1.optionType, ...obj2.optionType],
            position: [...obj1.position, ...obj2.position],
            strike: [...obj1.strike, ...obj2.strike],
            transDatePrice: [...obj1.transDatePrice, ...obj2.transDatePrice],
            OptionPrice: [...obj1.OptionPrice, ...obj2.OptionPrice],
            OTMSize: [...obj1.OTMSize, ...obj2.OTMSize],
            closeDate: [...obj1.closeDate, ...obj2.closeDate],
            pricesCDate: [...obj1.pricesCDate, ...obj2.pricesCDate],
            contractPrice: [...obj1.contractPrice, ...obj2.contractPrice],
            exerciseOutcome: [...obj1.exerciseOutcome, ...obj2.exerciseOutcome],
            totalPandL: [...obj1.totalPandL, ...obj2.totalPandL],
            outcome: [...obj1.outcome, ...obj2.outcome]
        };
    }
    else {
        mergedObject = {
            RIC: [...obj1.RIC, ...obj2.RIC],
            transDate: [...obj1.transDate, ...obj2.transDate],
            expDate: [...obj1.expDate, ...obj2.expDate],
            optionType: [...obj1.optionType, ...obj2.optionType],
            position: [...obj1.position, ...obj2.position],
            strike: [...obj1.strike, ...obj2.strike],
            transDatePrice: [...obj1.transDatePrice, ...obj2.transDatePrice],
            OptionPrice: [...obj1.OptionPrice, ...obj2.OptionPrice],
            OTMSize: [...obj1.OTMSize, ...obj2.OTMSize]
        };
    };

    return mergedObject;
};

