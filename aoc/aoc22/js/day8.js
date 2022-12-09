const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\r?\n/);
    return lines.map(line => [...line].map(c => Number.parseInt(c)));
}

function buildArray(w, h, v) {
    let array = [];
    for (let y = 0; y < h; ++y) {
        let row = [];
        for (let x = 0; x < w; ++x) {
            row.push(v);
        }
        array.push(row);
    }
    return array;
}

function isVisible(x0, y0, heights)
{
    const w = heights[0].length;
    const h = heights.length;

    // Visible if there is nothing higher to an edge.
    const height = heights[y0][x0];
    let visible = true;
    // look left
    let x=x0-1;
    while(visible && x >= 0){
        if (heights[y0][x] >= height){
            visible = false;
        }
        x--;
    }
    if (!visible){
        // look right
        visible = true;
        x=x0+1;
        while(visible && x < w){
            if (heights[y0][x] >= height){
                visible = false;
            }
            x++;
        }
    }
    if (!visible){
        visible = true;
        // look up
        let y=y0-1;
        while(visible && y >= 0){
            if (heights[y][x0] >= height){
                visible = false;
            }
            y--;
        }
    }
    if (!visible){
        visible = true;
        // look down
        y=y0+1;
        while(visible && y < h){
            if (heights[y][x0] >= height){
                visible = false;
            }
            y++;
        }
    }
    return visible;
}

function getViewingDistance(x0, y0, heights)
{
    const w = heights[0].length;
    const h = heights.length;

    // Visible if there is nothing higher to an edge.
    const height = heights[y0][x0];
    let leftDistance = 0;
    // look left
    let x=x0-1;
    while(x >= 0){
        ++leftDistance;
        if (heights[y0][x] >= height){
            break;
        }
        x--;
    }

    // look right
    let rightDistance = 0;
    x=x0+1;
    while(x < w){
        ++rightDistance;
        if (heights[y0][x] >= height){
            break;
        }
        x++;
    }

    // look up
    let upDistance=0;
    let y=y0-1;
    while(y >= 0){
        ++upDistance;
        if (heights[y][x0] >= height){
            break;
        }
        y--;
    }
    
    // look down
    let downDistance=0;
    y=y0+1;
    while(y < h){
        ++downDistance;
        if (heights[y][x0] >= height){
            break;
        }
        y++;
    }
    
    return leftDistance * rightDistance * upDistance * downDistance;
}

function countTruthy(array)
{
    return array.reduce((prev, cur) => {return prev+cur.reduce((p1, c1) => {return c1 ? p1+1 : p1}, 0)}, 0);
}

function part1(input) {
    const w = input[0].length;
    const h = input.length;
    let visibility = buildArray(w, h, true);
    for (let y = 1; y < h-1; ++y) {
        for (let x = 1; x < w-1; ++x) {
            visibility[y][x] = isVisible(x, y, input);
        }
    }
    return countTruthy(visibility);
}

function part2(input) {
    const w = input[0].length;
    const h = input.length;
    let maxDistance=0;
    for (let y = 1; y < h-1; ++y) {
        for (let x = 1; x < w-1; ++x) {
            let viewingDistance = getViewingDistance(x, y, input);
            if (viewingDistance > maxDistance){
                maxDistance = viewingDistance;
            }
        }
    }
    return maxDistance;
}

const DAY = 8;

let input = readFromFile(`../inputs/day${DAY}_example.txt`);
console.log("part 1 example = " + part1(input));
console.log("part 2 example = " + part2(input));

input = readFromFile(`../inputs/day${DAY}.txt`);
console.log("part 1 = " + part1(input));
console.log("part 2 = " + part2(input));
