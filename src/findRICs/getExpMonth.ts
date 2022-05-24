export { };
const moment = require('moment');

function getExpMont(expDate: string, optType: string) {
    
    let expMonth = '';
    const ident = {'1': {'exp': 'A','C': 'A', 'P': 'M'}, 
       '2': {'exp': 'B', 'C': 'B', 'P': 'N'}, 
       '3': {'exp': 'C', 'C': 'C', 'P': 'O'}, 
       '4': {'exp': 'D', 'C': 'D', 'P': 'P'},
       '5': {'exp': 'E', 'C': 'E', 'P': 'Q'},
       '6': {'exp': 'F', 'C': 'F', 'P': 'R'},
       '7': {'exp': 'G', 'C': 'G', 'P': 'S'}, 
       '8': {'exp': 'H', 'C': 'H', 'P': 'T'}, 
       '9': {'exp': 'I', 'C': 'I', 'P': 'U'}, 
       '10': {'exp': 'J', 'C': 'J', 'P': 'V'}, 
       '11': {'exp': 'K', 'C': 'K', 'P': 'W'}, 
       '12': {'exp': 'L', 'C': 'L', 'P': 'X'}}

    if (optType.toUpperCase() === 'C') {
        expMonth = ident[moment(expDate).format('M')].C
    }
    else if (optType.toUpperCase() === 'P') {
        expMonth = ident[moment(expDate).format('M')].P
    }
    return [ident, expMonth]
}

module.exports = getExpMont;