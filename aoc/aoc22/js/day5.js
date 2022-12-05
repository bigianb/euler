const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\r?\n/);
    const part1 = [];
    const part2 = [];
    lines.forEach(line => {
        if (line){
            if (line.startsWith("move")){
                part2.push(line);
            } else {
                part1.push(line);
            }
        }
    });
    return {stacks: parseStacks(part1), moves: parseMoves(part2)}
}

function parseStacks(lines)
{
    const numStacks = (lines[0].length + 1)/4;
    const numLines = lines.length - 1;
    const stacks = []
    for  (let stack=0; stack < numStacks; ++stack){
        stacks.push([]);
    }
    for (let lineNo=0; lineNo < numLines; ++lineNo){
        const line = lines[lineNo];
        for (let stack=0; stack < numStacks; ++stack){
            const stackVal = line[stack*4 + 1];
            if (stackVal && stackVal != ' '){
                stacks[stack].push(stackVal);
            }
        }
    }
    stacks.forEach(stack => stack.reverse());
    return stacks;
}

function parseMoves(lines)
{
    return lines.map(line => {
        const els = line.split(' ');
        return {
            num: els[1],
            from: els[3],
            to: els[5]
        }
    });
}

function part1({stacks, moves})
{
    moves.forEach(move => {
        for(let i=0; i < move.num; ++i){
            let c = stacks[move.from - 1].pop();
            stacks[move.to - 1].push(c);
        }
    });
    return stacks.map(stack => stack[stack.length-1]).join('');
}

function part2({stacks, moves})
{
    moves.forEach(move => {
        let moveStack = [];
        for(let i=0; i < move.num; ++i){
            moveStack.unshift(stacks[move.from - 1].pop());
        }
        stacks[move.to - 1].push(...moveStack);
    });
    return stacks.map(stack => stack[stack.length-1]).join('');
}

let input = readFromFile('../inputs/day5_example.txt');
console.log("day 5 part 1 example = " + part1(input));
input = readFromFile('../inputs/day5_example.txt');
console.log("day 5 part 2 example = " + part2(input));

input = readFromFile('../inputs/day5.txt');
console.log("day 5 part 1 = " + part1(input));
input = readFromFile('../inputs/day5.txt');
console.log("day 5 part 2 = " + part2(input));