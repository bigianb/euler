const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    return lines.map(line => line.split(''))
}

const dirMap = {
    '^': [0, -1],
    'v': [0, 1],
    '>': [1, 0],
    '<': [-1, 0]
}

const nextDir = {
    '^': '>',
    '>' : 'v',
    'v' : '<',
    '<' : '^'
}

function findGuard(input)
{
    for (let y=0; y < input.length; ++y){
        for (let x=0; x<input[0].length; ++x){
            if (input[y][x] !== '.' && input[y][x] !== '#'){
                return {d: input[y][x], x, y}
            }
        }
    }
    return null
}

function inRange(x, y, input)
{
    return (x >= 0 && y >= 0 && y < input.length && x < input[0].length);
}

function step(x, y, d, input)
{
    let delta = dirMap[d];
    let x1 = x + delta[0];
    let y1 = y + delta[1];
    while (inRange(x1, y1, input) && input[y1][x1] === '#'){
        d = nextDir[d];
        delta = dirMap[d];
        x1 = x + delta[0];
        y1 = y + delta[1];
    }
    return {x: x1, y: y1, d}
}

function part1(input) {
    let sum = 0;
    let {d, x, y} = findGuard(input);
    while(inRange(x, y, input)){
        if (input[y][x] !== 'X'){
            ++sum;
            input[y][x] = 'X'
        }
        let next = step(x, y, d, input);
        x = next.x;
        y = next.y;
        d = next.d
    }
    return sum;
}

const dirMask = {
    '^':  1,
    '>' : 2,
    'v' : 4,
    '<' : 8
}

function loopTest(x, y, d, input) {
    let visited = new Map();
    while(inRange(x, y, input)){
        const key = `${x}_${y}`;
        const v = visited.get(key) ?? 0;
        const m = dirMask[d];
        if (v & m){
            return true;
        }
        visited.set(key, v | m);

        let next = step(x, y, d, input);
        x = next.x;
        y = next.y;
        d = next.d
    }
    return false;
}

function part2(input)
{
    let obs = new Set()
    let {d, x, y} = findGuard(input);
    const startKey = `${x}_${y}`;

    const x0 = x;
    const y0 = y;
    const d0 = d;

    while(inRange(x, y, input)){
        let next = step(x, y, d, input)
   
        // consider placing an obstacle at next.x, next.y. If that would result in a position and dir we
        // have seen before then we have a loop.
        const o_key = `${next.x}_${next.y}`;
        
        if (inRange(next.x, next.y, input) && startKey !== o_key && !obs.has(o_key)){
            input[next.y][next.x] = '#';
            // not sure why we can't start at x, y, d
            if (loopTest(x0, y0, d0, input)){
                obs.add(o_key)
            }

            input[next.y][next.x] = '.';
        }

        x = next.x;
        y = next.y;
        d = next.d;
    }
    return obs.size;
}

console.log(part1(readFromFile('./inputs/day6.txt')));
console.log(part2(readFromFile('./inputs/day6.txt')));
