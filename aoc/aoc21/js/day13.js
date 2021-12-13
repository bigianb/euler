const fs = require('fs');
const internal = require('stream');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    let input = {positions: {}, folds: []}
    fileData.split(/\n/).forEach(line => {
        line = line.trim();
        if (line.startsWith('fold along ')){
            let els = line.split('=');
            input.folds.push({dir: els[0][els[0].length-1], pos: Number(els[1])});
        } else if (line.length > 0){
            input.positions[line] = line;
        }
    });
    return input;
}

function doFold(fold, positions)
{
    let newPositions = {}    

    for(let posStr of Object.keys(positions)){
        let xy = posStr.split(',').map(n => Number(n));
        if (fold.dir == 'x' && xy[0] > fold.pos){
            // fold left 0 -> pos - 1 | pos + 1 -> 2*pos
            // fold at 5 then 0 -> 4 stay same. 6 -> 10 => 4 - 0 (val - 1 - (x - (val + 1))
            let x = fold.pos - 1 - (xy[0] - (fold.pos + 1));
            xy[0] = x;
        } else if (fold.dir == 'y' && xy[1] > fold.pos){
            // fold up
            let y = fold.pos - 1 - (xy[1] - (fold.pos + 1));
            xy[1] = y;
        }
        let newKey = ''+xy[0]+','+xy[1];
        newPositions[newKey] = newKey;
    }
    
    return newPositions;
}

function solve1(input)
{
    let newpositions = doFold(input.folds[0], input.positions);
    console.log(Object.keys(newpositions).length);
}

function logPositions(positions)
{
    let rows = [];
    for (let r=0; r<50; ++r){
        rows[r] = [];
        for (let c=0; c<50; ++c){
            rows[r].push(' ');
        }
    }
    for(let pos of Object.keys(positions))
    {
        let xy = pos.split(',').map(n => Number(n));
        rows[xy[1]][xy[0]] = '#';
    }
    rows.forEach(row => console.log(row.join('')));
}

function solve2(input)
{
    let newpositions = input.positions;
    for (let fold of input.folds){
        newpositions = doFold(fold, newpositions);
    }
    logPositions(newpositions);
}


let input = readFromFile('./inputs/day13_example.txt');
console.log("day 13 part 1 example = " + solve1(input));
solve2(input);

input = readFromFile('./inputs/day13.txt');
console.log("day 13 part 1 = " + solve1(input));
solve2(input);
