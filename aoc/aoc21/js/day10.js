const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    return lines.map(line => line.split(''));
}

function checkSyntax(line) {
    const closers = {')': '(', ']': '[', '}': '{', '>': '<'}
    let tokenStack = []
    for (let i in line) {
        const c = line[i];
        if (closers[c]){
            if (tokenStack.length === 0 || tokenStack.pop() !== closers[c]){
                return {tokenStack, syntaxErrorPos:i};
            }
        } else {
            tokenStack.push(c);
        }
    }
    return {tokenStack, syntaxErrorPos:-1}
}

function solve1(lines) {
    const scoreVals = {')': 3, ']': 57, '}': 1197, '>': 25137}
    let score = 0;
    lines.forEach(line => {
        let {syntaxErrorPos} = checkSyntax(line);
        if (syntaxErrorPos >= 0) {
            score += scoreVals[line[syntaxErrorPos]]
        }
    });
    return score;
}

function scoreCompletion(tokenStack)
{
    const scoreVals = {'(': 1, '[': 2, '{': 3, '<': 4}
    let score = 0;
    while(tokenStack.length > 0){
        score = score * 5 + scoreVals[tokenStack.pop()];
    }
    return score;
}

function solve2(lines) {
    let scores = []
    lines.forEach(line => {
        let {tokenStack, syntaxErrorPos} = checkSyntax(line);
        if (syntaxErrorPos < 0) {
            scores.push(scoreCompletion(tokenStack));
        }
    });
    scores.sort((a, b) => a - b);
    return scores[(scores.length -1) / 2]
}

let lines = readFromFile('./inputs/day10_example.txt');
console.log("day 10 part 1 example = " + solve1(lines));
console.log("day 10 part 2 example = " + solve2(lines));

lines = readFromFile('./inputs/day10.txt');
console.log("day 10 part 1 = " + solve1(lines));
console.log("day 10 part 2 = " + solve2(lines));
