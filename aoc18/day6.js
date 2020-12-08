let points = [
    [81, 46],
[330, 289],
[171, 261],
[248, 97],
[142, 265],
[139, 293],
[309, 208],
[315, 92],
[72, 206],
[59, 288],
[95, 314],
[126, 215],
[240, 177],
[78, 64],
[162, 168],
[75, 81],
[271, 258],
[317, 223],
[210, 43],
[47, 150],
[352, 116],
[316, 256],
[269, 47],
[227, 343],
[125, 290],
[245, 310],
[355, 301],
[251, 282],
[353, 107],
[254, 298],
[212, 128],
[60, 168],
[318, 254],
[310, 303],
[176, 345],
[110, 109],
[217, 338],
[344, 330],
[231, 349],
[259, 208],
[201, 57],
[200, 327],
[354, 111],
[166, 214],
[232, 85],
[96, 316],
[151, 288],
[217, 339],
[62, 221],
[307, 68]
];

const testPoints = 
[
[1, 1],
[1, 6],
[8, 3],
[3, 4],
[5, 5],
[8, 9]
];

function findBoundingBox(thePoints)
{
    let bbox = {x0:1000000, y0:1000000, x1:0, y1:0};
    for (const point of thePoints){
        if (point[0] < bbox.x0){
            bbox.x0 = point[0];
        }
        if (point[0] > bbox.x1){
            bbox.x1 = point[0];
        }
        if (point[1] < bbox.y0){
            bbox.y0 = point[1];
        }
        if (point[1] > bbox.y1){
            bbox.y1 = point[1];
        }
    }
    return bbox;
}

// find the closest point to (x, y). If more than one is equally closest, return undefined.
function findClosest(x, y, thePoints)
{
    let distance = 1000000;
    let duplicateDistance = distance;
    let closest = undefined;
    for (let i=0; i<thePoints.length; ++i){
        let point = thePoints[i];
        let dist = Math.abs(point[0] - x) + Math.abs(point[1] - y);
        if (dist == distance){
            duplicateDistance = dist;
        }
        if (dist < distance){
            distance = dist;
            closest = i;
        }
    }
    return distance == duplicateDistance ? undefined: closest;
}

function sumDistance(x, y, thePoints)
{
    let d=0;
    for (let point of thePoints){
        d += Math.abs(point[0] - x) + Math.abs(point[1] - y);
    }
    return d;
}

// Count the number of cells for each point. Infinite areas a negative numbers.
function countAreas(w, h, area)
{
    let counts = []
    let idx=0;
    for (let y=0; y<h; ++y){
        for (let x=0; x<w; ++x){
            const val = area[idx];
            if (val){
                if (x==0 || y==0 || x == w-1 || y == h-1){
                    counts[val] = -1;
                } else {
                    if (!counts[val]){
                        counts[val] = 1;
                    } else {
                        if (counts[val] > 0){
                            counts[val] += 1;
                        }
                    }
                }
            }
            ++idx;
        }
    }

    return counts;
}

function printArea(area, w, h)
{
    let idx=0;
    for (let y=0; y<h; ++y){
        let line = "";
        for (let x=0; x<w; ++x){
            let c = area[idx] != undefined ? area[idx] : '.';
            line = line + c + ', ';
            ++idx;
        }
        console.log(line);
    }
}

// uncomment for testing
//points = testPoints;

const bbox = findBoundingBox(points);

const w = bbox.x1 - bbox.x0 + 1;
const h = bbox.y1 - bbox.y0 + 1;
let area = []

console.log('bbox = ' + bbox)

for (let y=0; y<h; ++y){
    for (let x=0; x<w; ++x){
        area.push(findClosest(x+bbox.x0, y+bbox.y0, points));
    }
}

//printArea(area, w, h)

let counts = countAreas(w, h, area);

let maxArea = -1;
let maxAreaCount = -1;
for (let i=0; i<counts.length; ++i){
    if (counts[i] && counts[i] > maxAreaCount){
        maxAreaCount=counts[i];
        maxArea=i;
    }
}
console.log(maxAreaCount);

// part 2
let count=0;
for (let y=0; y<h; ++y){
    for (let x=0; x<w; ++x){
        let d = sumDistance(x+bbox.x0, y+bbox.y0, points);
        if (d < 10000){
            ++count;
        }
    }
}
console.log(count);