const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    return lines[0].split(',').map(n => Number(n));
}

function alignLinear(numbers, tgt)
{
    return numbers.reduce((acc, v) => acc + Math.abs(tgt-v), 0);
}

function getSum(x)
{
    return x*(x+1)/2;
}

function alignCumulative(numbers, tgt)
{
    return numbers.reduce((acc, v) => acc + getSum(Math.abs(tgt-v)), 0);
}

function solve(numbers, alignFun)
{
    let maxPos = numbers.reduce((acc, v) => Math.max(acc, v), 0);

    let val = 10000000000;
    let bestPos = -1;
    for (let pos=0; pos <= maxPos; ++pos){
        let val2 = alignFun(numbers, pos);
        if (val2 < val){
            bestPos = pos;
            val = val2;
        }
    }
    return val;
}

let numbers = readFromFile('./inputs/day7_example.txt');
console.log("day 1 part 1 example = " + solve(numbers, alignLinear));
console.log("day 1 part 2 example = " + solve(numbers, alignCumulative));

numbers = readFromFile('./inputs/day7.txt');
console.log("day 1 part 1 example = " + solve(numbers, alignLinear));
console.log("day 1 part 2 example = " + solve(numbers, alignCumulative));
