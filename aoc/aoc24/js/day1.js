const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);

    const list1 = [];
    const list2 = [];
    lines.forEach(line => {
        line = line.trim();
        const parts = line.split('   ');
        if (parts.length === 2){
            list1.push(Number(parts[0]));
            list2.push(Number(parts[1]));
        } else {
            console.log(line);
        }
    });

    return {list1, list2};
}

function part1(list1, list2)
{
    list1.sort((a, b) => a - b);
    list2.sort((a, b) => a - b);
    let v = 0;
    for (let i=0; i<list1.length; ++i){
        v += Math.abs(list1[i] - list2[i]);
    }
    return v
}

function part2(list1, list2){
    let freqMap = new Map();
    for (let x of list2){
        let f = 1
        if (freqMap.has(x)){
            f = freqMap.get(x) + 1
        }
        freqMap.set(x, f);
    }
    let score = 0;
    for (let x of list1){
        if (freqMap.has(x)){
            score += x * freqMap.get(x);
        }
    }
    return score;
}

let {list1, list2} = readFromFile('./inputs/day1.txt');
let answer = part1(list1, list2)
console.log(answer);
let answer2 = part2(list1, list2)
console.log(answer2);
