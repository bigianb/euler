
function findNum(startNums, target)
{
    let history = new Map();
    let turn = 0;

    let lastSpoken = 0;
    for (let i of startNums){
        history.set(i, turn++);
        lastSpoken = i;
    }

    let lastSpokenWhen = -1;
    while (turn < target){
        lastSpoken  = lastSpokenWhen > 0 ? lastSpokenWhen : 0;
        lastSpokenWhen = history.has(lastSpoken) ? turn - history.get(lastSpoken) : 0;
        history.set(lastSpoken, turn++);
    }
    return lastSpoken;
}

console.log(''+findNum([0,3,6], 2020));

console.log(''+findNum([9,19,1,6,0,5,4], 2020));

console.log(''+findNum([0,3,6], 30000000));
console.log(''+findNum([9,19,1,6,0,5,4], 30000000));
