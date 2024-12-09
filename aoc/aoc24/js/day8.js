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
            
        }
    }
    return antennas;
}

function part1(input) {
    

}



console.log(part1(readFromFile('./inputs/day8_example.txt')));
//console.log(part2(readFromFile('./inputs/day8.txt')));
