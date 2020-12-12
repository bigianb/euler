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
    return {dir: line.slice(0,1), dist: Number(line.slice(1))}
}

function rotateLeft(dir)
{
    return {x: dir.y, y: -dir.x}
}

function rotateRight(dir)
{
    return {x: -dir.y, y: dir.x}
}

function applyInst(inst, state)
{
    if (inst.dir === 'F'){
        // F is the only instruction that moves the ship
        state.pos.x += state.waypoint.x * inst.dist;
        state.pos.y += state.waypoint.y * inst.dist;
        return;
    }
    let moveDir = null;
    switch(inst.dir)
    {
        case 'L':
            {
                let amount = inst.dist;
                while (amount > 0){
                    state.waypoint = rotateLeft(state.waypoint);
                    amount -= 90;
                }
            }
        break;
        case 'R':
            {
                let amount = inst.dist;
                while (amount > 0){
                    state.waypoint = rotateRight(state.waypoint);
                    amount -= 90;
                }
            }
        break
        case 'N':
            moveDir = {x:0, y:-1};
            break;
        case 'S':
            moveDir = {x:0, y:1};
            break;
        case 'E':
            moveDir = {x:1, y:0};
            break;
        case 'W':
            moveDir = {x:-1, y:0};
            break;  
        default:
            console.error('unknown dir ' + inst.dir);
    }
    if (moveDir){
        state.waypoint.x += moveDir.x * inst.dist;
        state.waypoint.y += moveDir.y * inst.dist;
    }
}

function applyInstructions(pos, waypoint, instructions)
{
    let state = {pos, waypoint};

    for (let inst of instructions){
        applyInst(inst, state);
    }
    return state.pos;
}

let instructions = readFromFile('../inputs/day11.txt');
let pos = applyInstructions({x:0, y:0}, {x:10, y:-1}, instructions)
console.log('Manhatten dist = ' + (Math.abs(pos.x) + Math.abs(pos.y)));
