const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    return fileData.split(/\n/).map(line => line.trim().split('').map(n => Number(n)));
}

function bumpNeighbours(octopusMap, r, c)
{
    let triggerFlash = false;
    const rmin = Math.max(0, r-1);
    const rmax = Math.min(9, r+1);
    const cmin = Math.max(0, c-1);
    const cmax = Math.min(9, c+1);
    for (let rt = rmin; rt <= rmax; ++rt){
        for (let ct=cmin; ct <= cmax; ++ct){
            if (rt != r || ct != c){
                if (octopusMap[rt][ct] !== 0){
                    octopusMap[rt][ct] += 1;
                    if (octopusMap[rt][ct] > 9){
                        triggerFlash = true;
                    }
                }
            }
        }
    }
    return triggerFlash;
}

function doStep(octopusMap)
{
    for (let r=0; r<10; ++r){
        for (let c=0; c<10; ++c){
            octopusMap[r][c] += 1;
        }
    }
    let numFlashes=0;
    let keepGoing=true;
    while(keepGoing){
        keepGoing=false;
        for (let r=0; r<10; ++r){
            for (let c=0; c<10; ++c){
                if (octopusMap[r][c] > 9){
                    octopusMap[r][c] = 0;
                    ++numFlashes;
                    keepGoing |= bumpNeighbours(octopusMap, r, c);
                }
            }
        }
    }
    return numFlashes;
}

function solve1(octopusMap)
{
    let flashes = 0;
    for (let step=0; step<100; ++step){
        flashes += doStep(octopusMap);
    }
    return flashes;
}

function solve2(octopusMap)
{
    let step=0;
    let numFlashes = 0;
    while (numFlashes != 100){
        numFlashes = doStep(octopusMap);
        ++step;
    }
    return step;
}

let octopusMap = readFromFile('./inputs/day11_example.txt');
console.log("day 11 part 1 example = " + solve1(octopusMap));
octopusMap = readFromFile('./inputs/day11_example.txt');
console.log("day 11 part 2 example = " + solve2(octopusMap));

octopusMap = readFromFile('./inputs/day11.txt');
console.log("day 11 part 1 = " + solve1(octopusMap.slice()));
octopusMap = readFromFile('./inputs/day11.txt');
console.log("day 11 part 2 = " + solve2(octopusMap));
