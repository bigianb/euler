const fs = require('fs');

const data2015 = require('./data/2015.json');
const data2016 = require('./data/2016.json');
const data2017 = require('./data/2017.json');
const data2018 = require('./data/2018.json');
const data2019 = require('./data/2019.json');
const data2020 = require('./data/2020.json');
const data2021 = require('./data/2021.json');
const data2022 = require('./data/2022.json');
const data2023 = require('./data/2023.json');
const data2024 = require('./data/2024.json');

// Figure out stars per year per member.

let allData = {}
addData(data2024, allData);
addData(data2023, allData);
addData(data2022, allData);
addData(data2021, allData);
addData(data2020, allData);
addData(data2019, allData);
addData(data2018, allData);
addData(data2017, allData);
addData(data2016, allData);
addData(data2015, allData);

addDisplayName(allData);

let yearlyStarsTable = createYearlyStarsTable(allData);

let stars2022 = createStarsForYearTable(allData, "2024");

let html = "<html>"+htmlHeader()+"<body>"+
            "<h1>2024 Leaderboard</h2>"+stars2022+
            "<h1>All years star count</h2>"+yearlyStarsTable+
            "</body></html>";
fs.writeFileSync('YearlyStars.html', html);

function htmlHeader()
{
    return "<head>\n"+
    '<meta charset="utf-8"/>\n'+
    '<title>Advent of Code Stats</title>\n'+
    '<link href="http://fonts.googleapis.com/css?family=Source+Code+Pro:300&subset=latin,latin-ext" rel="stylesheet" type="text/css"/>\n'+
    inlineStyle()+
    "</head>";
}

// Makes it easier to email the file
function inlineStyle()
{
    let style = fs.readFileSync('style.css', 'utf-8');
    return "<style>" + style + "</style>";
}

function addDisplayName(dataIn)
{
    Object.values(dataIn).forEach(member => {
        let displayName = member["2024"].name;
        switch(displayName)
        {
            case "stevemcqueeniscool":
                displayName = "Darren Gawley";
                break;
            case "BMK-work":
                displayName = "Bernard Kuc";
                break;
            case "GrumpyMetalGuy":
                displayName = "Peter Keysers";
                break;
            case "simonjpascoe":
                displayName = "Simon Pascoe";
                break;
            case "minu27":
                displayName = "Minal Vaity";
                break;
        }
        member.displayName = displayName;
    });
}

function createStarsForYearTable(dataIn, year)
{
    let values = Object.values(dataIn);
    values.sort((a, b) => {return b[year].local_score - a[year].local_score})

    let html = "<table>";
    html += "<thead><tr>";
    html += "<th>Player</th><th>Points</th><th>Stars</th>"
    html += "</tr></thead>";
    html += "<tbody>";
    values.forEach(member => {
        if (member[year].local_score > 0){
            html += "<tr>";
            html += "<td>"+member.displayName+"</td>";
            html += "<td>"+member[year].local_score+"</td>";
            html += "<td>"+member[year].stars+"</td>";
            html += "</tr>";
        }
    });
    html += "</tbody>"
    html += "</table>";
    return html;
}

function createYearlyStarsTable(dataIn)
{
    let values = Object.values(dataIn);
    values.sort((a, b) => {return b.TotalStars - a.TotalStars})

    let html = "<table>";
    html += "<thead><tr>";
    html += "<th>Player</th><th>Total</th><th>2015</th><th>2016</th><th>2017</th><th>2018</th><th>2019</th><th>2020</th><th>2021</th><th>2022</th><th>2023</th><th>2024</th>"
    html += "</tr></thead>";
    html += "<tbody>";
    values.forEach(member => {
        if (member.TotalStars > 0){
            html += "<tr>";
            html += "<td>"+member.displayName+"</td>";
            html += "<td>"+member.TotalStars+"</td>";
            html += "<td>"+member["2015"].stars+"</td>";
            html += "<td>"+member["2016"].stars+"</td>";
            html += "<td>"+member["2017"].stars+"</td>";
            html += "<td>"+member["2018"].stars+"</td>";
            html += "<td>"+member["2019"].stars+"</td>";
            html += "<td>"+member["2020"].stars+"</td>";
            html += "<td>"+member["2021"].stars+"</td>";
            html += "<td>"+member["2022"].stars+"</td>";
            html += "<td>"+member["2023"].stars+"</td>";
            html += "<td>"+member["2024"].stars+"</td>";
            html += "</tr>";
        }
    });
    html += "</tbody>"
    html += "</table>";
    return html;
}

function addData(dataIn, allDataIn)
{
    for(let memberId of Object.keys(dataIn.members))
    {
        if (!allDataIn[memberId]){
            allDataIn[memberId] = {TotalStars: 0}
        }
        yearData = {...dataIn.members[memberId]}
        allDataIn[memberId].TotalStars += yearData.stars;
        allDataIn[memberId][dataIn.event] = yearData;
    }
}