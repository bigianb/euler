const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    return lines.map(line => line.split('').map(n => Number(n)));
}

function isMinima(numbers, x, y)
{
    const ydim = numbers.length;
    const xdim = numbers[0].length;

    const val = numbers[y][x];
    if (x == 0 || numbers[y][x-1] > val){
        if (x == xdim-1 || numbers[y][x+1] > val){
            if (y == 0 || numbers[y-1][x] > val){
                if (y == ydim-1 || numbers[y+1][x] > val){
                    return true;
                }
            }
        }
    }
    return false;
}

function findMinima(numbers)
{
    let minima = []
    const ydim = numbers.length;
    const xdim = numbers[0].length;
    for (let y=0; y<ydim; ++y){
        for (let x=0; x < xdim; ++x){
            if (isMinima(numbers, x, y)){
                minima.push({x, y})
            }
        }
    }
    return minima
}

function solve1(numbers)
{
    let minima = findMinima(numbers);
    let risk = 0;
    minima.forEach(m => risk += 1 + numbers[m.y][m.x]);
    return risk;
}

function getKey(x, y)
{
    return ''+x+','+y;
}

function expandSeed(x, y, basin, numbers, prevVal)
{
    const key = getKey(x, y);
    const val = numbers[y][x];
    if (!basin.has(key) && val > prevVal && val != 9){
        basin.add(key)
        if (x > 0){
            expandSeed(x-1, y, basin, numbers, val);
        }
        if (x < numbers[0].length - 1){
            expandSeed(x+1, y, basin, numbers, val);
        }
        if (y > 0){
            expandSeed(x, y-1, basin, numbers, val);
        }
        if (y < numbers.length - 1){
            expandSeed(x, y+1, basin, numbers, val);
        }
    }
}

function solve2(numbers)
{
    let minima = findMinima(numbers);
    let basinSizes = [];
    minima.forEach(seed => {
        basin = new Set();
        expandSeed(seed.x, seed.y, basin, numbers, -1);
        basinSizes.push(basin.size);
    });
    basinSizes.sort((a, b) => b - a);
    return basinSizes[0] * basinSizes[1] * basinSizes[2];
}

let numbers = readFromFile('./inputs/day9_example.txt');
console.log("day 9 part 1 example = " + solve1(numbers));
console.log("day 9 part 2 example = " + solve2(numbers));

numbers = readFromFile('./inputs/day9.txt');
console.log("day 9 part 1 = " + solve1(numbers));
console.log("day 9 part 2 = " + solve2(numbers));
