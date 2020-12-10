const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    let output = [0]
    for (let line of lines){
        if (line != ""){
            output.push(Number(line));
        }
    }
    return output;
}

function countDiffs(list)
{
    let diffs = [0,0,0,0,0,0,0,0,0,0]
    for (let i=1; i<list.length; ++i){
        let prev = list[i-1]
        let diff = list[i] - prev;
        ++diffs[diff];
        if (diff > 3){
            console.error('found diff > 3');
        }
    }
    // account for the final adapter
    ++diffs[3];
    return diffs;
}

function countPerms(list, i = -1, memo = null)
{
    // Always need the final adapter, so start there.
    if (i === -1) {i = list.length-1;}

    // memoize previous results
    if (memo === null){
        memo = Array(list.length);
        for (let i=0; i<memo.length; ++i){
            memo[i] = -1;
        }
    }

    if (memo[i] >= 0){
        return memo[i];
    }

    if (i === 0) {return 1}

    let numPerms = 0;
    const thisVal = list[i];
    if (thisVal - list[i-1] <= 3){
        let perms = countPerms(list, i-1, memo);
        memo[i-1] = perms;
        numPerms += perms;
    }
    if (i > 1 && thisVal - list[i-2] <= 3){
        let perms = countPerms(list, i-2, memo);
        memo[i-2] = perms;
        numPerms += perms;
    }
    if (i > 2 && thisVal - list[i-3] <= 3){
        let perms = countPerms(list, i-3, memo);
        memo[i-3] = perms;
        numPerms += perms;
    }
    


    return numPerms;
}

let adapters = readFromFile('../inputs/day10_example.txt');
adapters.sort((a, b) => a-b);
console.log(adapters)
let diffs = countDiffs(adapters);
console.log(JSON.stringify(diffs));

adapters = readFromFile('../inputs/day10.txt');
adapters.sort((a, b) => a-b);
diffs = countDiffs(adapters);
console.log(JSON.stringify(diffs));
console.log('diffs[1] * diffs[3] = ' + diffs[1] * diffs[3]);

adapters = readFromFile('../inputs/day10_example.txt');
adapters.sort((a, b) => a-b);
let numPerms = countPerms(adapters);
console.log('num Perms = ' + numPerms);

adapters = readFromFile('../inputs/day10.txt');
adapters.sort((a, b) => a-b);
numPerms = countPerms(adapters);
console.log('num Perms = ' + numPerms);