const fs = require('fs');

function parserNumList(str) {
    return str.split(',').map(el => Number.parseInt(el.trim()));
}

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\r?\n/);

    let monkeys = [];
    let monkey = {};
    lines.forEach(line => {
        let parts = line.split(':').map(el => el.trim());
        let opcode = parts[0].split(' ');
        switch (opcode[0]) {
            case 'Monkey': {
                let monkeyNum = Number.parseInt(opcode[1]);
                monkey = {
                    monkeyNum
                };
                monkeys.push(monkey);
            }
            break;

        case 'Starting':
            monkey.items = parserNumList(parts[1]);
            break;
        case 'Operation':
            monkey.operation = parts[1][10];
            if (parts[1][12] === 'o') {
                monkey.operationOperand = 'old';
            } else {
                monkey.operationOperand = Number.parseInt(parts[1].substring(12));
            }
            break;
        case 'Test': {
            monkey.test = Number.parseInt(parts[1].split('y')[1]);
            break;
        }
        case 'If':
            {
                if (opcode[1] === 'true'){
                    monkey.throwTrue = Number.parseInt(parts[1].split('y')[1]);
                } else {
                    monkey.throwFalse = Number.parseInt(parts[1].split('y')[1]);
                }
            }
        }
    });

    console.log(monkeys);
    return monkeys;
}

function part1(input) {

    return 0;
}


function part2(input) {
    return 0;
}

const DAY = 11;

let input = readFromFile(`../inputs/day${DAY}_example.txt`);
console.log("part 1 example = " + part1(input));
console.log("part 2 example = " + part2(input));

input = readFromFile(`../inputs/day${DAY}.txt`);
console.log("part 1 = " + part1(input));
console.log("part 2 = " + part2(input));