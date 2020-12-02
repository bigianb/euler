const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    let output = []
    for (let line of lines){
        if (line != ""){
            output.push(processLine(line));
        }
    }
    return output;
}

function processLine(line)
{
    let parts = line.split(/\s+/);
    let minmaxParts = parts[0].split('-');
    return {
        min: Number(minmaxParts[0]),
        max: Number(minmaxParts[1]),
        letter: parts[1][0],
        password: parts[2]
    }
}

function countValid(data, validationFunction)
{
    let valid=0;
    for (let d of data){
        if (validationFunction(d)){
            ++valid;
        }
    }
    return valid;
}

function isValidPart1(d)
{
    let occurances =0;
    for (let c of d.password){
        if (c === d.letter){
            ++occurances;
        }
    }
    return (occurances >= d.min && occurances <= d.max);
}

function isValidPart2(d)
{
    let occurances =0;
    if (d.password[d.min-1] === d.letter){
        occurances++;
    }
    if (d.password[d.max-1] === d.letter){
        occurances++;
    }
    
    return occurances === 1;
}

const exampleData = readFromFile('../inputs/day2_example.txt');
console.log(countValid(exampleData, isValidPart1));
console.log(countValid(exampleData, isValidPart2));


const data = readFromFile('../inputs/day2.txt')
console.log(countValid(data, isValidPart1));
console.log(countValid(data, isValidPart2));
