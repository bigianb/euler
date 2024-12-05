const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    
    let rules = new Map();
    
    let lineNo = 0;
    while (lines[lineNo].length > 0){
        const parts = lines[lineNo].split('|');
        let a = parseInt(parts[0]);
        let b = parseInt(parts[1]);
        if (!rules.has(a)){
            rules.set(a, new Set())
        }
        rules.get(a).add(b)
        ++lineNo;
    }
    ++lineNo;
    let updates = [];
    while (lineNo < lines.length){
        updates.push(lines[lineNo++].split(',').map(n => parseInt(n)));
    }
    
    return {rules, updates}
}

function isValid(rules, update)
{
    let seen = new Set();
    for (let n of update){
        if (rules.has(n)){
            for (let x of rules.get(n)){
                if (seen.has(x)){
                    return false;
                }
            }
        }
        seen.add(n)
    }
    return true;
}

function part1({rules, updates}) {
    let sum = 0;
    for (let update of updates){
        if (isValid(rules, update)){
            sum += update[Math.floor(update.length / 2)]
        }
    }
    return sum;
}

function fixOrdering(rules, update)
{
    update.sort((a, b) => {
        if (rules.has(a)){
            if (rules.get(a).has(b)){
                //  got a | b rule, so a comes before b
                return -1
            }
        }
        if (rules.has(b)){
            if (rules.get(b).has(a)){
                // got b | a rule, so b comes before a
                return 1
            }
        }
        return 0;
    });
}

function part2({rules, updates}) {
    let sum = 0;
    for (let update of updates){
        if (!isValid(rules, update)){
            fixOrdering(rules, update);
            sum += update[Math.floor(update.length / 2)]
        }
    }
    return sum;
}

const input = readFromFile('./inputs/day5.txt');

console.log(part1(input));
console.log(part2(input));
