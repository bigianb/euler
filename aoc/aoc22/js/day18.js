const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\r?\n/);
    return lines.map(line => line.trim().split(',').map(n => Number.parseInt(n)));
}

const sides = [
    [-1, 0, 0],
    [1, 0, 0],
    [0, -1, 0],
    [0, 1, 0],
    [0, 0, -1],
    [0, 0, 1]
]

function part1(input) {
    const set = new Set();
    input.forEach(entry => {
        set.add(`${entry[0]},${entry[1]},${entry[2]}`);
    });
    let surfaceArea = 0;
    input.forEach(entry => {
        for (let side of sides) {
            let neighbourX = [entry[0] + side[0]];
            let neighbourY = [entry[1] + side[1]];
            let neighbourZ = [entry[2] + side[2]];
            let key = `${neighbourX},${neighbourY},${neighbourZ}`;
            if (!set.has(key)) {
                ++surfaceArea;
            }
        }
    });
    return surfaceArea;
}

function canEscape(cube, set, min, max){
    let visited = new Set();
    let out = escaped(cube, visited, set, min, max);
    if (!out){
        // Add any known internal spaces to the set.
        visited.forEach(v => set.add(v));
    }
    return out;
}

function escaped(cube, visited, set, min, max) {

    for (let i of [0,1,2]){
        if (cube[i] < min[i] || cube[i]> max[i]){
            return true;
        }
    }

    visited.add(`${cube[0]},${cube[1]},${cube[2]}`);
    for (let side of sides) {
        let neighbour = [cube[0] + side[0], cube[1] + side[1], cube[2] + side[2]];
        const nkey = `${neighbour[0]},${neighbour[1]},${neighbour[2]}`;
        if (!set.has(nkey) && !visited.has(nkey)){
            if (escaped(neighbour, visited, set, min, max)){
                return true;
            }
        }
    }
    return false;
}


function part2(input) {
    let min = [100000, 100000, 100000];
    let max = [-100000, -100000, -100000];
    input.forEach(entry => {
        for (let i of [0, 1, 2]) {
            if (entry[i] < min[i]) {
                min[i] = entry[i]
            };
            if (entry[i] > max[i]) {
                max[i] = entry[i]
            };
        }
    });
    const set = new Set();
    input.forEach(entry => {
        set.add(`${entry[0]},${entry[1]},${entry[2]}`);
    });
    let surfaceArea = 0;
    input.forEach(entry => {
        for (let side of sides) {
            let neighbourX = entry[0] + side[0];
            let neighbourY = entry[1] + side[1];
            let neighbourZ = entry[2] + side[2];
            let key = `${neighbourX},${neighbourY},${neighbourZ}`;
            if (!set.has(key)) {
                if (canEscape([neighbourX, neighbourY, neighbourZ], set, min, max)) {
                    ++surfaceArea;
                }
            }
        }
    });
    return surfaceArea;
}

const DAY = 18;

let input = readFromFile(`../inputs/day${DAY}_example.txt`);
console.log(input);
console.log("part 1 example = " + part1(input));
console.log("part 2 example = " + part2(input));

input = readFromFile(`../inputs/day${DAY}.txt`);
console.log("part 1 = " + part1(input));
console.log("part 2 = " + part2(input));