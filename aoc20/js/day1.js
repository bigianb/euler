const fs = require('fs');

function readNumbersFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\s/);
    let numbers = []
    for (let line of lines){
        if (line != ""){
            numbers.push(Number(line));
        }
    }
    return numbers;
}

function findPair(numbers, sum)
{
    const size = numbers.length;
    for (let i=0; i<size; ++i){
        const ni = numbers[i];
        for (let j=0; j<size; ++j){
            if (i != j){
                if (ni + numbers[j] == sum){
                    return [ni, numbers[j]];
                }
            }
        }
    }
    return [];
}

function findTriple(numbers, sum)
{
    const size = numbers.length;
    for (let i=0; i<size; ++i){
        const ni = numbers[i];
        for (let j=0; j<size; ++j){
            const nj = numbers[j];
            if (i != j && ni+nj < sum){
                for (let k=0; k<size; ++k){
                    if (j != k){
                        if (ni + nj + numbers[k] == sum){
                            return [ni, nj, numbers[k]];
                        }
                    }
                }
            }
        }
    }
    return [];
}

const exampleData = readNumbersFromFile('../inputs/day1_example.txt');
let pair = findPair(exampleData, 2020);
console.log(pair[0] * pair[1]);

const realData = readNumbersFromFile('../inputs/day1.txt');
pair = findPair(realData, 2020);
console.log(pair[0] * pair[1]);

pair = findTriple(realData, 2020);
console.log(pair[0] + ', ' + pair[1] + ', ' + pair[2] + ' = ' + (pair[0] + pair[1] + pair[2]));
console.log(pair[0] * pair[1] * pair[2]);
