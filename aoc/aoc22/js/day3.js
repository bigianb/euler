const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    return lines.map(line => {
        line = line.trim();
        const len = line.length / 2;
        const p1 = line.substring(0, len);
        const p2 = line.substring(len);
        return {p1, p2, line};
    });
}

function priority(c)
{
    const cCode = c.charCodeAt(0);
    const aCode = 'a'.charCodeAt(0);
    const ACode = 'A'.charCodeAt(0);
    if (cCode >= aCode && cCode <= aCode + 26){
        return cCode - aCode + 1;
    } else {
        return cCode - ACode + 27;
    }
}

function part1(pairs)
{
    let sum=0;
    pairs.forEach(pair => {
        const {p1, p2} = pair;
        const shared = p1.split('').filter(c => p2.includes(c));
        const uniqueShared = [... new Set(shared)];
        sum += priority(uniqueShared[0]);
    });
    return sum;
}

function getPart2Rucksacks(lines)
{
    const numLines = lines.length;
    let line = 0;
    let ruckSacks = [];
    while (line < numLines){
        ruckSacks.push([lines[line].line, lines[line+1].line, lines[line+2].line]);
        line += 3;
    }
    return ruckSacks;
}

function part2(input)
{
    let sum=0;
    let ruckSacks = getPart2Rucksacks(input);
    ruckSacks.forEach(ruckSack => {
        const shared = ruckSack[0].split('').filter(c => ruckSack[1].includes(c) && ruckSack[2].includes(c));
        const uniqueShared = [... new Set(shared)];
        sum += priority(uniqueShared[0]);
    });
    return sum;
}

let pairs = readFromFile('../inputs/day3_example.txt');


console.log("day 3 part 1 example = " + part1(pairs));
console.log("day 3 part 2 example = " + part2(pairs));

pairs = readFromFile('../inputs/day3.txt');
console.log("day 3 part 1 = " + part1(pairs));
console.log("day 3 part 2 = " + part2(pairs));
