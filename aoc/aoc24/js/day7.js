const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    return lines.map(line => {
        const els = line.split(': ');
        const ans = parseInt(els[0]);
        const digits = els[1].split(' ').map(x => parseInt(x))
        return {ans, digits}
    })
}

function valid1(expr)
{
    const helper = (n, i) => {
        if (i === expr.digits.length){
            return n === expr.ans;
        }
        if (n > expr.ans){
            // no negative or positive numbers.
            return false;
        }
        // 2 options + or *
        return helper(n + expr.digits[i], i+1) || helper(n * expr.digits[i], i+1);
    }
    return helper(expr.digits[0], 1);
}

function part1(input)
{
    let sum=0;
    for(let expr of input){
        if (valid1(expr)){
            sum += expr.ans;
        }
    }
    return sum;
}

function valid2(expr)
{
    const helper = (n, i) => {
        if (i === expr.digits.length){
            return n === expr.ans;
        }
        if (n > expr.ans){
            // no negative or positive numbers.
            return false;
        }
        // 3 options +, * or ||
        return helper(n + expr.digits[i], i+1) || helper(n * expr.digits[i], i+1) || helper(parseInt(''+n + expr.digits[i]), i+1);
    }
    return helper(expr.digits[0], 1);
}

function part2(input)
{
    let sum=0;
    for(let expr of input){
        if (valid2(expr)){
            sum += expr.ans;
        }
    }
    return sum;
}

console.log(part1(readFromFile('./inputs/day7_example.txt')));
console.log(part1(readFromFile('./inputs/day7.txt'))); 
console.log(part2(readFromFile('./inputs/day7_example.txt')));
console.log(part2(readFromFile('./inputs/day7.txt')));