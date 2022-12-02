const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    return lines.map(line => line.trim().split(' '));
}

const myChoiceVals = {
    X: 1,
    Y: 2,
    Z: 3
}

const winLosDrawVals = {
    AX: 3,          // Rock Rock Draw
    AY: 6,          // Rock Paper Win
    AZ: 0,          // Rock Scissors Lose
    BX: 0,          // Paper Rock Lose
    BY: 3,
    BZ: 6,
    CX: 6,          // Scissors Rock win
    CY: 0,
    CZ: 3
}

const whatToPlay = {
    AX: 'Z',          // Rock lose
    AY: 'X',          // Rock draw
    AZ: 'Y',          // Rock win
    BX: 'X',          // Paper  Lose, rock
    BY: 'Y',
    BZ: 'Z',
    CX: 'Y',              // Scissors Lose
    CY: 'Z',
    CZ: 'X'
}

function calcSum2(pairs)
{
    let total=0;
    pairs.forEach(pair => {
        let choice = whatToPlay[pair[0]+ pair[1]];
        let val = myChoiceVals[choice];
        val += winLosDrawVals[pair[0]+ choice];

        total += val;
    });

    return total;
}

function calcSum(pairs)
{
    let total=0;
    pairs.forEach(pair => {
        let val = myChoiceVals[pair[1]];
        val += winLosDrawVals[pair[0]+ pair[1]];

        total += val;
    });

    return total;
}

let pairs = readFromFile('../inputs/day2_example.txt');

console.log("day 2 part 1 example = " + calcSum(pairs));
console.log("day 2 part 2 example = " + calcSum2(pairs));

pairs = readFromFile('../inputs/day2.txt');
console.log("day 2 part 1 = " + calcSum(pairs));
console.log("day 2 part 2 = " + calcSum2(pairs));

