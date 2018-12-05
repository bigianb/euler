// How many Sundays fell on the first of the month during the twentieth century (1 Jan 1901 to 31 Dec 2000)?

var moment = require('moment');

let numSundays = 0;
for (let year=1901; year < 2001; ++year){
    for (let mon=0; mon<12; ++mon){
        let day = moment([year, mon, 1]).day();
        if (day == 0){
            ++numSundays;
        }
    }
}
console.log(numSundays);
