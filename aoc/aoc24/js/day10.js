const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');

    const lines = fileData.split(/\n/);
    return lines.map(line => line.split('').map(x => +x))
}

function findHeads(topoMap)
{
    let heads = [];
    for (let row=0; row < topoMap.length; ++row){
        for (let col=0; col < topoMap[row].length; ++col){
            if (topoMap[row][col] === 0){
                heads.push([row, col])
            }
        }
    }
    return heads;
}

function trailScore(topoMap, head){
    let ends = new Set();
    let paths = 0;
    const dfs = (row, col) => {
        const v = topoMap[row][col];
        if (v === 9){
            ends.add(`${row},${col}`);
            ++paths;
            return;
        }
        if (row > 0 && topoMap[row-1][col] === v+1){
            dfs(row-1, col)
        }
        if (row < topoMap.length - 1 && topoMap[row+1][col] === v+1){
            dfs(row+1, col)
        }
        if (col > 0 && topoMap[row][col-1] === v+1){
            dfs(row, col-1)
        }
        if (col < topoMap[row].length - 1 && topoMap[row][col+1] === v+1){
            dfs(row, col+1)
        }
    }

    dfs(head[0], head[1])

    return {ends: ends.size, paths};
}

function part1(topoMap){
    heads = findHeads(topoMap);
    let sum = 0;
    for (let head of heads){
        sum += trailScore(topoMap, head).ends
    }
    return sum;
}

function part2(topoMap){
    heads = findHeads(topoMap);
    let sum = 0;
    for (let head of heads){
        sum += trailScore(topoMap, head).paths
    }
    return sum;
}

console.log(part1(readFromFile('./inputs/day10_example.txt')));
console.log(part1(readFromFile('./inputs/day10.txt')));
console.log(part2(readFromFile('./inputs/day10_example.txt')));
console.log(part2(readFromFile('./inputs/day10.txt')));  
                                                            
