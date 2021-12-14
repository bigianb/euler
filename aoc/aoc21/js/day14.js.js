const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    let input = {pairs: {}}
    let lines = fileData.split(/\n/).map(line => line.trim());
    input.initial = lines[0].split('');
    lines.slice(2).forEach(line => {
            let els = line.split(' -> ');
            input.pairs[els[0]] = els[1];
    });
    return input;
}

function step(chain, pairs)
{
    let newChain = [];
    for (let i=0; i<chain.length-1; ++i){
        let pval = ''+chain[i] + chain[i+1];
        newChain.push(chain[i]);
        if(pairs[pval]){
            newChain.push(pairs[pval]);
        }
    }
    newChain.push(chain[chain.length-1]);
    return newChain;
}

function countElements(chain)
{
    let counts = {}
    chain.forEach( c => {
        if (!counts[c]){
            counts[c] = 1;
        } else {
            counts[c] += 1;
        }
    })
    return counts;
}

function solve1(input)
{
    let chain = input.initial;
    for (let stepNo=0; stepNo < 10; ++stepNo){
        chain = step(chain, input.pairs);
    }
    counts = countElements(chain);
    let vals = Object.values(counts);
    console.log(counts);
    return Math.max(...vals) - Math.min(...vals);
}

function stepQuick(chain, transforms, counts)
{
    let newChain = {...chain};

    for(let p of Object.keys(chain)){
        let np = chain[p];
        let v = transforms[p];
        if (v){
            if(!newChain[v[0]]){
                newChain[v[0]] = np;
            } else {
                newChain[v[0]] += np;
            }
            if(!newChain[v[1]]){
                newChain[v[1]] = np;
            } else {
                newChain[v[1]] += np;
            }

            if (!counts[v[2]]){
                counts[v[2]] = np;
            } else {
                counts[v[2]] += np;
            }
        }
        if (newChain[p]){
            newChain[p] -= np;
        }
    }

    return newChain;
}

function solve2(input)
{
    let transforms = {};
    Object.keys(input.pairs).forEach(pair => {
        let els = pair.split('');
        let ins = input.pairs[pair];
        transforms[pair] = [''+els[0]+ins, ''+ins+els[1], ins];
    });
    let chain = {}
    for (let i=0; i<input.initial.length-1; ++i){
        let pair = ''+input.initial[i] + input.initial[i+1];
        if (!chain[pair]){
            chain[pair] = 1;
        } else {
            chain[pair] += 1;
        }
    }
    let counts = {}
    input.initial.forEach( c => {
        if (!counts[c]){
            counts[c] = 1;
        } else {
            counts[c] += 1;
        }
    })
    for (let stepNo=0; stepNo < 40; ++stepNo){
        chain = stepQuick(chain, transforms, counts);
    }
    let vals = Object.values(counts);
    console.log(counts);
    return Math.max(...vals) - Math.min(...vals);
}


let input = readFromFile('./inputs/day14_example.txt');
console.log("day 14 part 1 example = " + solve1(input));
console.log("day 14 part 2 = " + solve2(input));

input = readFromFile('./inputs/day14.txt');
console.log("day 14 part 1 = " + solve1(input));
console.log("day 14 part 2 = " + solve2(input));
