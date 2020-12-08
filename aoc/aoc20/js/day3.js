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
    return line;
}

function countTrees(data, right, down)
{
    const width = data[0].length;
    const height = data.length;
    let trees = 0;
    let x=0;
    let y=0;
    while (y < height)
    {
        let c = data[y][x % width];
        if (c === '#'){++trees}
        x += right;
        y += down;
    }
    return trees;
}

const exampleData = readFromFile('../inputs/day3_example.txt');
console.log("example: " + countTrees(exampleData, 3, 1));

let data = readFromFile('../inputs/day3.txt');
console.log("part 1: " + countTrees(data, 3, 1));

let t = countTrees(data, 1, 1)
t *= countTrees(data, 3, 1)
t *= countTrees(data, 5, 1)
t *= countTrees(data, 7, 1)
t *= countTrees(data, 1, 2)
console.log("part 2: " + t);
