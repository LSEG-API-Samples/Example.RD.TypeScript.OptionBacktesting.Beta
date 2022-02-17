module.exports = function toJSON(optionTrans: any, title: string = null) {
    let resultObj: any = {};

    if (title !== null) {
        resultObj["title"] = title
    }
    let allResults = []
    for (let i = 0; i < optionTrans.RIC.length; i++) {
        let ricResult = {}
        for (let key in optionTrans) {
            ricResult[key] = optionTrans[key][i]
            ricResult['year'] = new Date(optionTrans.expDate[i]).getFullYear()
        }
        allResults.push(ricResult)
    }
    resultObj["values"] = allResults;
    return resultObj
}