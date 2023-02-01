const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\r?\n/);

    return lines.map(line => {
        const els = line.split(' ');
        const imm = els.length > 1 ? Number.parseInt(els[1]) : 0;
        return { op: els[0], imm };
    });
}

function part1(input) {

    const testCycles = [20, 60, 100, 140, 180, 220];

    let x = 1;
    let cycle = 1;
    let totalStrength = 0;
    input.forEach(instr => {
        switch(instr.op){
            case 'noop':
                cycle += 1;
            break;
            case 'addx':
                cycle += 1;
                if (testCycles.includes(cycle)){
                    totalStrength += x * cycle;
                }
                cycle += 1;
                x += instr.imm;
            break;
            default:
                throw `unknown opcode ${instr.op}`
        }
        if (testCycles.includes(cycle)){
            totalStrength += x * cycle;
        }
    });
    return totalStrength;
}

function getPixVal(cycle, x)
{
    const col = cycle % 40;
    if (col === x-1 || col === x || col === x+1){
        return '#';
    } else {
        return ' ';
    }
}

function part2(input) {
    let crt = [];
    let x = 1;
    let cycle = -1;
    let row = [];
    input.forEach(instr => {
        switch(instr.op){
            case 'noop':
                cycle += 1;
                row.push(getPixVal(cycle, x));
                if (row.length === 40){
                    crt.push(row);
                    row = [];
                }
            break;
            case 'addx':
                cycle += 1;
                row.push(getPixVal(cycle, x));
                if (row.length === 40){
                    crt.push(row);
                    row = [];
                }
                cycle += 1;
                row.push(getPixVal(cycle, x));
                if (row.length === 40){
                    crt.push(row);
                    row = [];
                }
                x += instr.imm;
            break;
            default:
                throw `unknown opcode ${instr.op}`
        }
        
    });
    if (row.length > 0){
        crt.push(row);
    }
    let s = '';
    crt.forEach(row => {
        s += row.join('');
        s += '\n';
    })
    console.log(s);
    return 0;
}

const DAY = 10;

let input = readFromFile(`../inputs/day${DAY}_example.txt`);
console.log("part 1 example = " + part1(input));
console.log("part 2 example = " + part2(input));

input = readFromFile(`../inputs/day${DAY}.txt`);
console.log("part 1 = " + part1(input));
console.log("part 2 = " + part2(input));
