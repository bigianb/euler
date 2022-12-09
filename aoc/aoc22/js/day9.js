const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\r?\n/);
    return lines.map(line => { let s = line.split(' '); return { dir: s[0], dist: Number.parseInt(s[1]) } });
}

function part1(input) {
    let visited = new Set();

    let headPos = { x: 0, y: 0 };
    let tailPos = { x: 0, y: 0 };

    visited.add(`${tailPos.x},${tailPos.y}`);
    input.forEach(inst => {
        let dx = 1;   // right
        let dy = 0;
        switch (inst.dir) {
            case 'U':
                dx = 0; dy = -1;
                break;
            case 'D':
                dx = 0; dy = 1;
                break;
            case 'L':
                dx = -1; dy = 0;
                break;
        }
        for (let i = 0; i < inst.dist; ++i) {
            headPos.x += dx;
            headPos.y += dy;
            let lenX = Math.abs(headPos.x - tailPos.x);
            let lenY = Math.abs(headPos.y - tailPos.y);
            if (lenX > 1 || lenY > 1){
                // If the tail is dragged, it lines up right where the head was before.
                tailPos.x = headPos.x - dx;
                tailPos.y = headPos.y - dy;
                visited.add(`${tailPos.x},${tailPos.y}`);
            }
        }
    });

    return visited.size;
}

function part2(input, numKnots = 10) {
    let visited = new Set();

    let positions = [];
    for (let i=0; i<numKnots; ++i){
        positions.push({ x: 0, y: 0 });
    }
    let tailPos = positions[numKnots-1];

    visited.add(`${tailPos.x},${tailPos.y}`);
    input.forEach(inst => {
        
        for (let i = 0; i < inst.dist; ++i) {
            let dx = 1;   // right
            let dy = 0;
            switch (inst.dir) {
                case 'U':
                    dx = 0; dy = -1;
                    break;
                case 'D':
                    dx = 0; dy = 1;
                    break;
                case 'L':
                    dx = -1; dy = 0;
                    break;
            }
            for (let knotNum = 0; knotNum < numKnots-1; ++knotNum){
                let thisPos = positions[knotNum];
                let nextPos = positions[knotNum+1];
                thisPos.x += dx;
                thisPos.y += dy;

                let lenX = Math.abs(thisPos.x - nextPos.x);
                let lenY = Math.abs(thisPos.y - nextPos.y);

                if (lenX > 1 || lenY > 1){
                    // Not touching
                    if (lenX === 0){
                        // same col
                        dx = 0;
                        dy = thisPos.y > nextPos.y ? 1 : -1;
                    } else if (lenY === 0){
                        dy = 0;
                        dx = thisPos.x > nextPos.x ? 1 : -1;
                    } else {
                        // take a diagonal move
                        dx = thisPos.x > nextPos.x ? 1 : -1;
                        dy = thisPos.y > nextPos.y ? 1 : -1;
                    }

                    if (knotNum === numKnots - 2){
                        // next is the real tail
                        tailPos.x += dx;
                        tailPos.y += dy;
                        visited.add(`${tailPos.x},${tailPos.y}`);
                    }
                } else {
                    dx = 0; dy = 0;
                }
            }
        }
    });

    return visited.size;
}

const DAY = 9;

let input = readFromFile(`../inputs/day${DAY}_example.txt`);
console.log("part 1 example = " + part2(input, 2));
input = readFromFile(`../inputs/day${DAY}_example2.txt`);
console.log("part 2 example = " + part2(input, 10));

input = readFromFile(`../inputs/day${DAY}.txt`);
console.log("part 1 = " + part2(input, 2));
console.log("part 2 = " + part2(input, 10));
