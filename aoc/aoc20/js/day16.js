const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);

    let fieldDefs=[];
    let ticket=[];
    let nearbyTickets=[];

    let state = 'field ranges';

    for (let line of lines){
        line = line.trim();
        
        if (line === 'your ticket:'){
            state = 'your ticket'
        } else if (line === 'nearby tickets:'){
            state = 'nearby tickets'
        } else if (line !== '') {
            switch (state)
            {
                case 'field ranges':
                    fieldDefs.push(parseFieldDef(line));
                break;
                case 'your ticket':
                    ticket = parseNumList(line);
                break;
                case 'nearby tickets':
                    nearbyTickets.push(parseNumList(line));
                break;
                default:
                    console.error('Unknown state: ' + state);
                break
            }
        }
    }
    return {fieldDefs, ticket, nearbyTickets};
}
function parseNumList(line)
{
    return line.split(',').map(x => Number(x));
}

function parseFieldDef(line)
{
    let x = line.split(': ');
    let name = x[0];
    let ranges = x[1].trim().split(' or ').map(yy =>yy.split('-').map(x => Number(x)));

    return {name, ranges};
}

let data = readFromFile('../inputs/day16_example.txt');
console.log(JSON.stringify(data));
