const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);

    const elves = []

    let elf = [];
    lines.forEach(line => {
        line = line.trim();
        if (!line){
            if (elf.length > 0){
                elves.push(elf);
                elf = [];
            }
        } else {
            elf.push(Number.parseInt(line));
        }
    });
    if (elf.length > 0){
        elves.push(elf);
    }
    return elves;
}

function sumElves(elves)
{
    const sums = [];
    elves.forEach(elf => {
        sums.push(elf.reduce((a, b) => a + b, 0));
    });
    return sums;
}

let elves = readFromFile('../inputs/day1_example.txt');
let sum = sumElves(elves);
sum.sort((a, b) => b - a);

console.log("day 1 part 1 example = " + sum[0]);
console.log("day 1 part 2 example = " + (sum[0] + sum[1] + sum[2]));

elves = readFromFile('../inputs/day1.txt');
sum = sumElves(elves);
sum.sort((a, b) => b - a);
console.log("day 1 part 1 = " + sum[0]);
console.log("day 1 part 2 = " + (sum[0] + sum[1] + sum[2]));
