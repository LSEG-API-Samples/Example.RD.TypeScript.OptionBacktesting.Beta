export { };

const moment = require('moment');
const Holidays = require('date-holidays');
const getExpDates = require('./getExpDates');
const hd = new Holidays('US');

function getTransDays(year: number, transDay = 'first') {
    let transDays = [];
    if (transDay === 'first') {
        for (let i = 1; i <= 12; i++) {
            let first_working_day = new moment([year, i - 1]);

            if (first_working_day.day() == 0) {
                first_working_day = first_working_day.add(1, 'day');
            }
            else if (first_working_day.day() % 6 == 0) {
                first_working_day = first_working_day.add(2, 'day');
            };

            const forHoliday = first_working_day.add(1, 'day');
            const isHoliday = hd.isHoliday(forHoliday)
            first_working_day = first_working_day.subtract(1, 'day')

            if (isHoliday === false) {
                transDays.push(first_working_day.format('D'));
            }
            else if (isHoliday !== false) {
                const typeHoliday = isHoliday[0]['type'];

                if (typeHoliday === 'public') {
                    first_working_day = first_working_day.add(1, 'day');

                    if (first_working_day.day() == 0) {
                        first_working_day = first_working_day.add(1, 'day');
                    }
                    else if (first_working_day.day() % 6 == 0) {
                        first_working_day = first_working_day.add(2, 'day');
                    }
                    transDays.push(moment(first_working_day, "DD-MM-YYYY").format('D'));
                }
                else {
                    transDays.push(first_working_day.format('D'));
                };
            };
        };
        return transDays;
    }
    else if (transDay === 'third') {
        const transDays = getExpDates(year);
        return transDays;
    }
    else {
        console.log('Please input "first" or "third" for transaction day');
    };
};

module.exports = getTransDays;

// console.log(getTransDays(2021, 'first'))
