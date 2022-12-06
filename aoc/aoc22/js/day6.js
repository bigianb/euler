const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    return fileData;
}


function findMarker(input, markerLen)
{
    let startPos=markerLen-1;
    let found=false;
    while(!found && startPos < input.length){
        let potentialStartCode = input.slice(startPos-markerLen+1, startPos+1);
        let set = new Set(potentialStartCode);
        if (set.size === markerLen){
            found = true;
        }
        startPos += 1;
    }
    return found ? startPos : NaN;
}

let input = readFromFile('../inputs/day6_example.txt');
console.log("part 1 example = " + findMarker(input, 4));
console.log("part 2 example = " + findMarker(input, 14));

input = readFromFile('../inputs/day6.txt');
console.log("part 1 = " + findMarker(input, 4));
console.log("part 2 = " + findMarker(input, 14));