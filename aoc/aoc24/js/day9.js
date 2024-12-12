const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');

    let digits = fileData.split('').map(x => parseInt(x));
    let output = []
    let id = 0;
    let start=0;
    for (let i=0; i<digits.length; i += 2){
        const len = digits[i];
        output.push({id, start, len})
        id++;
        start += len;
        if (i < digits.length - 1){
            start += digits[i+1];
        }
    }
    return output;
}



function part1(input) {
    let start = 0;
    let end = input.length - 1;
    let sum = 0;
    let pos = 0;
    while (start <= end){
        // accumulate the start IDs
        const so = input[start];
        for (let i=0; i<so.len; ++i){
            sum += so.id * pos++;
        }
        so.len = 0;
        ++start;
        if (start >= input.length){
            break;
        }
        let nextStart = input[start].start;
        // fill gaps from end
        while (pos < nextStart && end > 0){
            let eo = input[end];
            if (eo.len > 0){
                sum += eo.id * pos++;
                eo.len -= 1;
            }
            if (eo.len === 0){
                --end;
            }
        }
    }
    return sum;
}

function part2(input) {

    let compacted = [...input];
    let moveMade;
    do{
        moveMade = false;
        for (let j=compacted.length - 1; j >= 0 && !moveMade; --j){
            const moving = compacted[j];
            if (moving.moved){
                continue;
            }
            moving.moved = true;
            for (let i=0; i<j && !moveMade; ++i){
                let gap = compacted[i+1].start - compacted[i].start - compacted[i].len;
                if (gap >= moving.len){
                    let newCompacted = [];
                    for (let k=0; k <= i; ++k){
                        newCompacted.push(compacted[k]);
                    }
                    newCompacted.push(moving);
                    for (let k=i+1; k < compacted.length; ++k){
                        const o = compacted[k];
                        if (o.id !== moving.id){
                            newCompacted.push(o)
                        }
                    }
                    moving.start = compacted[i].start + compacted[i].len;
                    compacted = newCompacted;
                    moveMade = true;
                    break;
                }
            }
        }
    } while (moveMade)
    //console.log(JSON.stringify(compacted))
    let sum = 0;
    for(let i=0; i < compacted.length; ++i){
        let x = compacted[i];
        for (let j=0; j<x.len; ++j){
            sum += x.id * (x.start + j);
        }
    }
    
    return sum;
}

console.log(part1(readFromFile('./inputs/day9_example.txt')));
console.log(part1(readFromFile('./inputs/day9.txt')));
console.log(part2(readFromFile('./inputs/day9_example.txt')));
console.log(part2(readFromFile('./inputs/day9.txt')));  
                                                            
