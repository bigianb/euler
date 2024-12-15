const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');

    const lines = fileData.split(/\n/);
    return lines.map(line => line.split(''))
}


function findRegions(garden)
{
    const h = garden.length;
    const w = garden[0].length;
    const visited = garden.map(r => new Array(r.length).fill(0))

    let regions = [];

    const explore = (r, y, x) => {
        if (visited[y][x]){
            return
        }
        visited[y][x] = 1

        const c = garden[y][x]
        r.area += 1;
        if (y > 0 && garden[y-1][x] === c){
            explore(r, y-1, x);
        } else {
            r.perim += 1
            r.top.push({major: y, minor: x})
        }
        if (y < garden.length - 1 && garden[y+1][x] === c){
            explore(r, y+1, x);
        } else {
            r.perim += 1
            r.bottom.push({major: y, minor: x})
        }
        if (x > 0 && garden[y][x-1] === c){
            explore(r, y, x-1);
        } else {
            r.perim += 1
            r.left.push({major: x, minor: y})
        }
        if (x < garden[y].length -1 && garden[y][x+1] === c){
            explore(r, y, x+1)
        } else {
            r.perim += 1;
            r.right.push({major: x, minor: y})
        }
    }

    for (let row=0; row < h; ++row){
        for (let col = 0; col < w; ++col){
            if (!visited[row][col]){
                let region = {area:0, perim: 0, left: [], right: [], top: [], bottom: []}
                explore(region, row, col);
                regions.push(region);
            }
        }
    }

    return regions;
}

function countContig(array)
{
    // group by contiguous section where the major is always equal and the minor in continual
    const majors = new Map();
    for (a of array){
        if (!majors.has(a.major)){
            majors.set(a.major, [])
        }
        majors.get(a.major).push(a.minor);
    }

    let sum = 0;

    for (let minors of majors.values()){
        minors.sort((a, b) => a-b);
        // always have one side (consider edge case where only one minor)
        sum += 1
        for (let i=1; i<minors.length; ++i){
            if (minors[i-1] != minors[i] - 1){
                // found a break, so a new side
                sum += 1;
            }
        }
    }

    return sum;
}

function calcSides(region)
{
    return countContig(region.left) + countContig(region.right) + countContig(region.top) + countContig(region.bottom);
}

/*
Due to "modern" business practices, the price of fence required for a region is found by multiplying that region's area by its perimeter. The total price of fencing all regions on a map is found by adding together the price of fence for every region on the map.
*/
function part1(garden)
{
    return findRegions(garden).reduce((acc, cur) => acc + cur.area * cur.perim, 0)
}

function part2(garden)
{
    return findRegions(garden).reduce((acc, cur) => acc + cur.area * calcSides(cur), 0)
}

console.log(part1(readFromFile('./inputs/day12_example.txt')));
console.log(part1(readFromFile('./inputs/day12.txt')));
console.log(part2(readFromFile('./inputs/day12_example.txt')));
console.log(part2(readFromFile('./inputs/day12.txt')));  
   