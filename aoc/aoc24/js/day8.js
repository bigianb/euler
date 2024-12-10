const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    return lines.map(line => line.split(''))
}

function findAntennas(input)
{
    const antennas = new Map();
    for (let row=0; row < input.length; ++row){
        const theRow = input[row];
        for (let col=0; col < theRow.length; ++col){
            const c = input[row][col];
            if (c !== '.'){
                if (!antennas.has(c)){
                    antennas.set(c, []);
                }
                antennas.get(c).push({row, col});
            }
        }
    }
    return antennas;
}

function getAntinodes(pos1, pos2){
    const dCol = pos2.col - pos1.col;
    const dRow = pos2.row - pos1.row;

    const output = [];
    output.push({row: pos2.row + dRow, col: pos2.col + dCol});
    output.push({row: pos1.row - dRow, col: pos1.col - dCol});
    return output;
}

function part1(input) {
    const w = input[0].length;
    const h = input.length;
    const antennas = findAntennas(input);
    const antinodeSet = new Set();
    for (let antennaVal of antennas.keys()){
        const positions = antennas.get(antennaVal);
        for(let i=0; i<positions.length - 1; ++i){
            for (let j=i+1; j < positions.length; ++j){
                const antinodes = getAntinodes(positions[i], positions[j]);
                for (let antinode of antinodes){
                    if (antinode.col >= 0 && antinode.row >= 0 && antinode.col < w && antinode.row < h){
                        antinodeSet.add(`${antinode.col}_${antinode.row}`)
                    }
                }
            }
        }
    }
    return antinodeSet.size;
}

function getAntinodes2(pos1, pos2, w, h){
    const dCol = pos2.col - pos1.col;
    const dRow = pos2.row - pos1.row;

    const output = [];
    let dmul = 0;
    while (true){
        const an = {row: pos2.row + dmul*dRow, col: pos2.col + dmul*dCol}
        if (an.col < 0 || an.row < 0 || an.col >= w || an.row >= h){
            break;
        }
        output.push(an);
        dmul++;
    }
    dmul = 0;
    while (true){
        const an = {row: pos1.row - dmul*dRow, col: pos1.col - dmul*dCol}
        if (an.col < 0 || an.row < 0 || an.col >= w || an.row >= h){
            break;
        }
        output.push(an);
        dmul++;
    }
    return output;
}

function part2(input) {
    const w = input[0].length;
    const h = input.length;
    const antennas = findAntennas(input);
    const antinodeSet = new Set();
    for (let antennaVal of antennas.keys()){
        const positions = antennas.get(antennaVal);
        for(let i=0; i<positions.length - 1; ++i){
            for (let j=i+1; j < positions.length; ++j){
                const antinodes = getAntinodes2(positions[i], positions[j], w, h);
                for (let antinode of antinodes){
                    antinodeSet.add(`${antinode.col}_${antinode.row}`)
                }
            }
        }
    }
    return antinodeSet.size;
}

console.log(part1(readFromFile('./inputs/day8_example.txt')));
console.log(part1(readFromFile('./inputs/day8.txt')));
console.log(part2(readFromFile('./inputs/day8_example.txt')));
console.log(part2(readFromFile('./inputs/day8.txt')));
