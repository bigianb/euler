const fs = require('fs');
const {performance } = require('perf_hooks');

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
        for (let j=i+1; j<size; ++j){
            if (ni + numbers[j] == sum){
                return [ni, numbers[j]];
            }
        }
    }
    return [];
}

function findTriple(numbers, sum)
{
    const size = numbers.length;
    for (let i=0; i<size-2; ++i){
        const ni = numbers[i];
        for (let j=i+1; j<size-1; ++j){
            const nj = numbers[j];
            if (ni+nj < sum){
                for (let k=j+1; k<size; ++k){
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

const startT = performance.now();
pair = findTriple(realData, 2020);
const endT = performance.now();
console.log(pair[0] + ', ' + pair[1] + ', ' + pair[2] + ' = ' + (pair[0] + pair[1] + pair[2]));
console.log(pair[0] * pair[1] * pair[2]);
console.log("Took "+ (endT - startT) + " ms");

/*
output:
  514579
  878724
  266, 989, 765 = 2020
  201251610
  Took 3.1257929988205433 ms
*/