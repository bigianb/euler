const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    let output = []
    for (let line of lines){
        if (line != ""){
            output.push(processLine(line));
        }
    }
    return output;
}

function processLine(line)
{
    line = line.trim();
    let row = [];
    for (let c of line){
        row.push(c);
    }
    return row;
}

function isOccupied(layout, r, c)
{
    const val = getVal(layout, r, c);
    return val === '#' ? 1 : 0;
}

function getVal(layout, r, c)
{
    if (r<0 || r >= layout.length){
        return '';
    }
    if (c<0 || c >= layout[0].length){
        return '';
    }
    return layout[r][c]
}

function isNearestOccupied(layout, r0, c0, deltaR, deltaC)
{
    let r=r0, c=c0
    let occupied = -1;
    do {
        r += deltaR;
        c += deltaC;
        const val = getVal(layout, r, c);
        if (val === '' || val === 'L'){
            occupied = 0;
        } else if (val === '#'){
            occupied = 1;
        }
    } while (occupied < 0);
    return occupied;
}

function countOccupied(layout, r, c)
{
    let count=0;
    count += isNearestOccupied(layout, r, c, -1, -1);
    count += isNearestOccupied(layout, r, c, -1, 0);
    count += isNearestOccupied(layout, r, c, -1, +1);
    count += isNearestOccupied(layout, r, c, 0, -1);
    count += isNearestOccupied(layout, r, c, 0, +1);
    count += isNearestOccupied(layout, r, c, +1, -1);
    count += isNearestOccupied(layout, r, c, +1, 0);
    count += isNearestOccupied(layout, r, c, +1, +1);
    return count;
}

function doIteration(layout)
{
    let newLayout = [];
    let numChanges = 0;

    const numRows = layout.length;
    const numCols = layout[0].length;
    for (let r=0; r<numRows; ++r){
        let newRow = [];
        for (let c=0; c<numCols; ++c){
            const oldVal = layout[r][c];
            if (oldVal === '.'){
                newRow.push('.');
            } else {
                let numOccupied = countOccupied(layout, r, c);
                if (oldVal === 'L' && numOccupied === 0){
                    newRow.push('#'); ++numChanges;
                } else if (oldVal === '#' && numOccupied >= 5){
                    newRow.push('L'); ++numChanges;
                } else {
                    newRow.push(oldVal);
                }
            }
        }
        newLayout.push(newRow);
    }

    return {newLayout, numChanges};
}

function countTotalOccupied(layout)
{
    let num=0;
    for (let row of layout){
        for (let c of row){
            num += c === '#' ? 1 : 0;
        }
    }
    return num;
}

let layout = readFromFile('../inputs/day11.txt');

let numChanges = 0;
do {
    let iterResults = doIteration(layout);
    layout = iterResults.newLayout;
    numChanges = iterResults.numChanges;
} while (numChanges > 0);

console.log('' + countTotalOccupied(layout));

