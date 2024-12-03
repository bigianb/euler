const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    return fileData;
}

function part1(input) {
    const regexp = /mul\((\d+),(\d+)\)/g;
    return [...input.matchAll(regexp)].reduce((acc, cur) => acc + parseInt(cur[1])*parseInt(cur[2]), 0);
}

function part2(input) {
    let start = 0;
    let sum = 0;
    while (start < input.length - 1){
        let end = input.indexOf("don't()", start);
        if (end === -1){
            end = input.length;
        }
        sum += part1(input.slice(start, end));
        start = end;
        if (start < input.length -1){
            start = input.indexOf("do()", start);
            if (start < 0){
                start = input.length;
            }
        }
    }
    return sum;
}

const input = readFromFile('./inputs/day3.txt');

console.log(part1(input));
console.log(part2("xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))"));
console.log(part2(input));