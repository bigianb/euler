const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    let output = []
    for (let line of lines){
        if (line != ""){
            output.push(processLine(line));
        }
    }
    return output;
}

function processLine(line)
{
    let parts = line.trim().split(' ');
    return {opcode: parts[0], arg: Number(parts[1])}
}

function executeLine(prog, state)
{
    let inst = prog[state.pc];
    switch (inst.opcode)
    {
        case 'acc':
            state.acc += inst.arg;
            state.pc++;
            break;
        case 'jmp':
            state.pc += inst.arg;
            break;
        case 'nop':
            state.pc++;
        break;
        default:
            console.log('unknown opcode ' + inst.opcode);
            state.pc++;
        break;
    }

}

function part1(prog)
{
    let lines = Array(prog.length);
    let state= {pc:0, acc: 0}
    while (lines[state.pc] === undefined){
        lines[state.pc] = state.acc;
        executeLine(prog, state);
    }
    return state.acc;
}

function flipNopJmp(prog, mutationPC)
{
    let inst = prog[mutationPC];
    if (inst.opcode === 'nop'){
        inst.opcode = 'jmp';
    } else if (inst.opcode === 'jmp'){
        inst.opcode = 'nop';
    }
}

function runMutated(prog, mutationPC)
{
    flipNopJmp(prog, mutationPC);

    let state= {pc:0, acc: 0}
    let lines = Array(prog.length);
    while (state.pc < lines.length && lines[state.pc] === undefined){
        lines[state.pc] = state.acc;
        executeLine(prog, state);
    }
    flipNopJmp(prog, mutationPC);

    return state;
}

function part2(prog)
{
    let attempt = 0;
    while (attempt < prog.length)
    {
        let state = runMutated(prog, attempt);
        if (state.pc === prog.length){
            return state.acc;
        }
        ++attempt;
    }
    return undefined;
}

let prog = readFromFile('../inputs/day8.txt');
let acc = part1(prog);
console.log(JSON.stringify(acc))

acc = part2(prog);
console.log(JSON.stringify(acc))
