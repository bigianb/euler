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

function isValid(val, ranges)
{
    return ranges.reduce((valid, range) => {return valid || (val >= range[0] && val <= range[1])}, false)
}

function findInvalidValues(data)
{
    let invalidValues = [];
    for(let ticket of data.nearbyTickets){
        for (let val of ticket){
            let valid = data.fieldDefs.filter(def => isValid(val, def.ranges));
            if (valid.length === 0){
                invalidValues.push(val);
            }
        }
    }
    return invalidValues;
}

function isTicketValid(ticket, fieldDefs)
{
    for (let val of ticket){
        let valid = fieldDefs.filter(def => isValid(val, def.ranges));
        if (valid.length === 0){
            return false;
        }
    }
    return true;
}

function findValidTickets(data)
{
    return data.nearbyTickets.filter(ticket => isTicketValid(ticket, data.fieldDefs));
}

function findCandidatePositions(tickets, fieldDef)
{
    let positions = new Set();
    for (let pos=0; pos < tickets[0].length; ++pos){
        positions.add(pos);
    }
    for (let ticket of tickets){
        for (let pos=0; pos < ticket.length; ++pos){
            const val = ticket[pos];
            if (!isValid(val, fieldDef.ranges)){
                positions.delete(pos);
            }
        }
    }
    return positions;
}

function findValidPositions(tickets, fieldDefs)
{
    for (let def of fieldDefs){
        def.candidatePositions = findCandidatePositions(tickets, def);
    }
}

function assignPositions(fieldDefs)
{
    let numRemaining = fieldDefs.length;
    while (numRemaining > 0){
        for (let def of fieldDefs){
            if (def.candidatePositions.size === 1){
                def.position = def.candidatePositions.values().next().value;
                def.candidatePositions.clear();
                --numRemaining;
                for (let def2 of fieldDefs){
                    def2.candidatePositions.delete(def.position);
                }
            }
        }
    }
}

let data = readFromFile('../inputs/day16_example.txt');
let invalidValues = findInvalidValues(data);
console.log('Example,should be 71: '+invalidValues.reduce((a,b) => a+b));

data = readFromFile('../inputs/day16.txt');
let validTickets = findValidTickets(data);
findValidPositions(validTickets, data.fieldDefs)
assignPositions(data.fieldDefs);

let result=1;
for (let def of data.fieldDefs){
    if (def.name.startsWith("departure")){
        let val = data.ticket[def.position];
        result *= val;
    }
}
console.log('part 2 result: '+result);

