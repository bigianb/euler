const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);

    const seeds = [];
    let els = lines[0].split(' ');
    for (let i=1; i<els.length; ++i){
        seeds.push(Number(els[i]));
    }

    input = {seeds}
    let accum = null;
    for (let i=2; i<lines.length; ++i){
        const line = lines[i];
        if (line.endsWith(':')){
            if (accum){
                accum.sort((a, b) => a[1] - b[1]);
            }
            accum = [];
            const key = line.split(' ')[0];
            input[key] = accum;
        } else if (line.length > 0){
            let la = []
            for (let n of line.split(' ')){
                la.push(Number(n));
            }
            accum.push(la)
        }
    }
    accum.sort((a, b) => a[1] - b[1]);
    return input;
}

function doMap(v, map){
    for (let entry of map){
        if (entry[1] <= v && v < entry[1]+entry[2]){
            return entry[0] + v - entry[1]
        }
    }
    return v;
}

function part1(filename)
{
    let input = readFromFile(filename);
    let minLoc = Number.MAX_VALUE;
    for (let seed of input.seeds){
        let v = doMap(seed, input['seed-to-soil']);
        v = doMap(v, input['soil-to-fertilizer']);
        v = doMap(v, input['fertilizer-to-water']);
        v = doMap(v, input['water-to-light']);
        v = doMap(v, input['light-to-temperature']);
        v = doMap(v, input['temperature-to-humidity']);
        v = doMap(v, input['humidity-to-location']);
        minLoc = Math.min(v, minLoc);
    }
    return minLoc;
}

function part2(filename)
{
    let input = readFromFile(filename);
    let minLoc = Number.MAX_VALUE;
    for (let i=0; i<input.seeds.length; i += 2){
        const seed=input.seeds[i];
        for (let j=0; j<input.seeds[i+1]; ++j){
            let v = doMap(seed+j, input['seed-to-soil']);
            v = doMap(v, input['soil-to-fertilizer']);
            v = doMap(v, input['fertilizer-to-water']);
            v = doMap(v, input['water-to-light']);
            v = doMap(v, input['light-to-temperature']);
            v = doMap(v, input['temperature-to-humidity']);
            v = doMap(v, input['humidity-to-location']);
            minLoc = Math.min(v, minLoc);
        }
    }
    return minLoc;
}

console.log(part1('./inputs/day5_example.txt'))
console.log(part1('./inputs/day5.txt'))
console.log(part2('./inputs/day5_example.txt'))
console.log(part2('./inputs/day5.txt'))