const getEaster = require('./getEaster');
const Holidays = require('date-holidays');
const hd = new Holidays('US');

function getExpDates(year: number) {
    let expDates = [];
    let thirdfriday = 0;
    for (let i = 1; i <= 12; i++) {
        let friday = 6 - (new Date(i + '/01/' + year).getDay());

        if (friday === 0) {
            thirdfriday = friday + 21;
        }
        else {
            thirdfriday = friday + 14;
        };

        const isHoliday = hd.isHoliday(new Date(Date.UTC(year, i - 1, thirdfriday)));
        const isEaster = new Date(Date.UTC(year, i - 1, thirdfriday)).valueOf() == getEaster(year, -2).valueOf();

        if (isHoliday === false && isEaster === false) {
            expDates.push(thirdfriday);
        }
        else if (isEaster === true) {
            expDates.push(thirdfriday - 1);
        }
        else if (isHoliday !== false) {
            const typeHoliday = isHoliday[0]['type'];
            if (typeHoliday === 'public') {
                expDates.push(thirdfriday - 1);
            }
            else {
                expDates.push(thirdfriday);
            };
        };

    };
    return expDates;
};

module.exports = getExpDates;

// console.log(getExpDates(2019))
