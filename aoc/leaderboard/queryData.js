const axios = require('axios');
const fs = require('fs');

const session = require('./sessionKey.json');

function fetchYear(year)
{
    const url = "https://adventofcode.com/"+year+"/leaderboard/private/view/472514.json"

    return axios.get(url, {
        headers: {
            Cookie: "session="+session.session+";"
        }
    }).then(response => {
        return response.data;
    });
}

let years = ['2015', '2016', '2017', '2018', '2019', '2020', '2021'];

promises = []
for (let year of years){
    let p = fetchYear(year).then(data => {
        const filename = './data/'+year+'.json';
        fs.writeFileSync(filename, JSON.stringify(data));
        console.log('wrote ' + filename);
    });
    promises.push(p);
}
Promise.all(promises).then( x => {
    console.log('Done');
});
