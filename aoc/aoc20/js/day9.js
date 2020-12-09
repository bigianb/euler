const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    let output = []
    for (let line of lines){
        if (line != ""){
            output.push(Number(line));
        }
    }
    return output;
}

function findException(numbers, preamble_len, test_len)
{
    let idx = preamble_len;
    while(idx < numbers.length){
        const target = numbers[idx];
        const bufStart = idx - test_len;
        let ok = false;
        for (let i=bufStart; i<idx-1 && !ok; ++i){
            for (let j=i+1; j<idx && !ok; ++j){
                if (numbers[i] + numbers[j] === target){
                    ok = true;
                }
            }
        }
        if (!ok){
            break;
        }
        ++idx;
    }
    return numbers[idx];
}

function sumHighLow(numbers, i, j)
{
    let min = numbers[i];
    let max = numbers[i];
    for (let x=i+1; x<=j; ++x){
        const n = numbers[x];
        if (n > max) {max = n}
        if (n < min) {min = n}
    }
    return min+max;
}

function part2(numbers, preamble_len, test_len)
{
    let exceptionNum = findException(numbers, preamble_len, test_len);
    for (let i=0; i<numbers.length-1; ++i){
        let tally=numbers[i];
        for (let j=i+1; j<numbers.length; ++j){
            tally += numbers[j];
            if (tally === exceptionNum){
                return sumHighLow(numbers, i, j);
            }
        }
    }
    return 0;
}

let data = readFromFile('../inputs/day9.txt');
console.log(part2(data, 25, 25))
