const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);

    return lines.map(line => line.split(' ').map(x => parseInt(x)));
}

function valid(v0, v1, increasing) {
    const thisIncreasing = v1 > v0;
    if (increasing !== thisIncreasing) {
        return false;
    }
    const diff = Math.abs(v1 - v0)
    if (diff === 0 || diff > 3) {
        return false;
    }
    return true;
}

function isSafe(row) {
    const increasing = row[1] > row[0];
    for (let i = 0; i < row.length - 1; ++i) {
        if (!valid(row[i], row[i + 1], increasing)) {
            return false;
        }
    }
    return true;
}

function part1(input) {
    let numSafe = 0;
    for (const row of input) {
        if (isSafe(row)) {
            ++numSafe;
        }
    }
    return numSafe;
}

function exclude(array, i) {
    return array.filter((v, j) => j != i);
}

function isSafe2(row) {
    const increasing = row[1] > row[0];
    for (let i = 0; i < row.length - 1; ++i) {
        if (!valid(row[i], row[i + 1], increasing)) {
            if (i === row.length - 2) {
                // just remove the last element.
                return true;
            }
            // remove element at i or at i+1
            if (isSafe(exclude(row, i)) || isSafe(exclude(row, i + 1))) {
                return true;
            }
            if (i > 0 && isSafe(exclude(row, i-1))){
                // Edge case when we need to remove the first value because the increasing / decreasing flag is wrong.
                return true;
            }
            return false;
        }
    }
    return true;
}

function part2(input) {
    let numSafe = 0;
    for (const row of input) {
        if (isSafe2(row)) {
            ++numSafe;
        }
    }
    return numSafe;
}

const input = readFromFile('./inputs/day2.txt');

console.log(part1(input));
console.log(part2(input));
