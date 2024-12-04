const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    return lines.map(line => line.split(''));
}

const dirs = [
    [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]
]

function find(array, row, col, dir, str){
    let x = col;
    let y = row;
    for (let i=0; i<str.length; ++i){
        x += dir[0];
        y += dir[1];
        if (x < 0 || y<0 || x >= array[0].length || y >=array.length){
            return 0;
        }
        if (array[y][x] !== str[i]){
            return 0;
        }
    }
    return 1;
}

function part1(input) {
    let sum = 0;
    for (let row = 0; row < input.length; ++row) {
        for (let col = 0; col < input[0].length; ++col) {
            if (input[row][col] === 'X') {
                for (let dir of dirs){
                    sum += find(input, row, col, dir, 'MAS');
                }
            }
        }
    }
    return sum;
}

function part2(input) {
    let sum = 0;
    for (let row = 1; row < input.length - 1; ++row) {
        for (let col = 1; col < input[0].length - 1; ++col) {
            if (input[row][col] === 'A') {
                const tl = input[row-1][col-1];
                const br = input[row+1][col+1];
                if ((tl === 'M' && br === 'S') || (tl === 'S' && br === 'M')){
                    const tr = input[row-1][col+1];
                    const bl = input[row+1][col-1];
                    if ((tr === 'M' && bl === 'S') || (tr === 'S' && bl === 'M')){
                        sum++;
                    }
                }
            }
        }
    }
    return sum;
}

const input = readFromFile('./inputs/day4.txt');

console.log(part1(input));
console.log(part2(input));
