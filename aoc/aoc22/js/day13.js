const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\r?\n/);
    const numLines = lines.length;
    const input = [];
    for (let i = 0; i < numLines; i += 3) {
        input.push({ left: lines[i], right: lines[i + 1] });
    }
    return input;
}

// Splits a string representation of a list into an array of the top level components.
function getEntries(list) {
    let entries = [];
    // ignore the start and end []
    let accumulator = "";
    let depth = 0;
    for (let i = 1; i < list.length - 1; i++) {
        const c = list[i];
        switch (c) {
            case ',':
                if (depth === 0) {
                    entries.push(accumulator);
                    accumulator = "";
                } else {
                    accumulator += c;
                }
                break;
            case '[':
                depth++;
                accumulator += c;
                break;
            case ']':
                depth--;
                accumulator += c;
                break;
            default:
                accumulator += c;
        }
    }
    if (accumulator !== "") {
        entries.push(accumulator);
    }
    if (depth !== 0) {
        throw ("depth should be 0");
    }
    return entries;
}

const CORRECT = -1;
const INCORRECT = 1;
const MAYBE = 0;

function isOrderCorrect(left, right) {
    if (left[0] !== '[' && right[0] !== '[') {
        const iLeft = Number.parseInt(left);
        const iRight = Number.parseInt(right)
        if (iLeft < iRight) {
            return CORRECT;
        }
        if (iLeft === iRight) {
            return MAYBE;
        }
        return INCORRECT;
    } else if (left[0] !== '[') {
        left = '[' + left + ']';
    } else if (right[0] !== '[') {
        right = '[' + right + ']';
    }
    // left and right are both arrays now
    let result = MAYBE;
    let leftEntries = getEntries(left);
    let rightEntries = getEntries(right);
    let i = 0;
    while (result === MAYBE && i < leftEntries.length && i < rightEntries.length) {
        result = isOrderCorrect(leftEntries[i], rightEntries[i]);
        ++i;
    }
    if (result === MAYBE) {
        if (leftEntries.length < rightEntries.length) {
            result = CORRECT;
        } else if (leftEntries.length > rightEntries.length) {
            result = INCORRECT;
        }
    }
    return result;
}

function part1(input) {
    let index = 1;
    let sum = 0;
    for (const obj of input) {
        if (isOrderCorrect(obj.left, obj.right) === CORRECT) {
            sum += index;
        }
        ++index;
    }
    return sum;
}

function part2(input) {
    let packets = ['[[2]]', '[[6]]'];
    input.forEach(i => { packets.push(i.left); packets.push(i.right) });
    packets.sort((left, right) => isOrderCorrect(left, right));

    let i1 = packets.indexOf('[[2]]') + 1;
    let i2 = packets.indexOf('[[6]]') + 1;

    return i1 * i2;
}

const DAY = 13;

let input = readFromFile(`../inputs/day${DAY}_example.txt`);
console.log("part 1 example = " + part1(input));
console.log("part 2 example = " + part2(input));

input = readFromFile(`../inputs/day${DAY}.txt`);
console.log("part 1 = " + part1(input));
console.log("part 2 = " + part2(input));
