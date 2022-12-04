const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    return lines.map(line => {
        let pair = line.trim().split(',');
        return [parseRange(pair[0]), parseRange(pair[1])];
    });
}

function parseRange(rangeStr)
{
    let parts = rangeStr.split('-');
    return [Number.parseInt(parts[0]), Number.parseInt(parts[1])];
}

function fullyContains(r1, r2)
{
    return r1[0] <= r2[0] && r1[1] >= r2[1];
}

function overlaps(r1, r2)
{
    return (r1[0] >= r2[0] && r1[0] <= r2[1]) || (r1[1] >= r2[0] && r1[1] <= r2[1]);
}

function part1(input)
{
    let sum=0;
    input.forEach(val => {
        if (fullyContains(val[0], val[1]) || fullyContains(val[1], val[0])){
            sum += 1;
        }
    });
    return sum;
}

function part2(input)
{
    let sum=0;
    input.forEach(val => {
        if (overlaps(val[0], val[1]) || overlaps(val[1], val[0])){
            sum += 1;
        }
    });
    return sum;
}

let input = readFromFile('../inputs/day4_example.txt');


console.log("day 4 part 1 example = " + part1(input));
console.log("day 4 part 2 example = " + part2(input));

input = readFromFile('../inputs/day4.txt');
console.log("day 4 part 1 = " + part1(input));
console.log("day 4 part 2 = " + part2(input));
