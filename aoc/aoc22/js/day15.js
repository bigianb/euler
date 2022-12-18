const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\r?\n/);
    return lines.map(line => {
        const parts = line.split(':');
        return { sensor: parseXY(parts[0].substring(10)), beacon: parseXY(parts[1].substring(22)) };
    });
}

function parseXY(str) {
    const xystr = str.split(',').map(el => el.split('=')[1].trim());
    return { x: Number.parseInt(xystr[0]), y: Number.parseInt(xystr[1]) };
}

function getManhattanDist(p1, p2) {
    const deltax = Math.abs(p1.x - p2.x);
    const deltay = Math.abs(p1.y - p2.y);
    return deltax + deltay;
}

function inRange(x, xmin, xmax) {
    if (xmin === undefined || x >= xmin) {
        if (xmax === undefined || x <= xmax) {
            return true;
        }
    }
    return false;
}

function processLine(input, lineNo, xmin, xmax) {
    const knownNoBeaconPos = new Set();
    input.forEach(entry => {
        const dist = getManhattanDist(entry.sensor, entry.beacon);
        // How far we have to travel to get to the correct line.
        const yDist = Math.abs(lineNo - entry.sensor.y);
        if (yDist <= dist) {
            const xExpansion = dist - yDist;
            for (let dx = 0; dx <= xExpansion; ++dx) {
                const x1 = entry.sensor.x - dx;
                const x2 = entry.sensor.x + dx;
                if (inRange(x1, xmin, xmax)) {
                    knownNoBeaconPos.add(x1);
                }
                if (inRange(x2, xmin, xmax)) {
                    knownNoBeaconPos.add(x2);
                }
            }
        }
    });
    return knownNoBeaconPos;
}

function part1(input, lineNo) {
    const knownNoBeaconPos = processLine(input, lineNo);

    // Remove any beacons on the line
    input.forEach(entry => {
        if (entry.beacon.y === lineNo) {
            if (knownNoBeaconPos.delete(entry.beacon.x));
        }
    })
    return knownNoBeaconPos.size;
}

// Consolidate a an array of {x0, x1} ranges.
function consolidate(ranges) {
    ranges.sort((a, b) => a.x0 - b.x0);

    const len = ranges.length;
    let consolidated = [];
    let el0 = { ...ranges[0] };
    for (let i = 1; i < len; ++i) {
        const el1 = ranges[i];
        if (el1.x0 <= el0.x1) {
            // overlap
            el0.x1 = Math.max(el0.x1, el1.x1);
        } else {
            consolidated.push(el0);
            el0 = { ...el1 };
        }
    }
    consolidated.push(el0);
    return consolidated;
}

// return true if can contain an unknown beacon.
function lineHasUnknownBeacon(input, lineNo, xmax) {
    const knownNoBeaconPos = new Set();
    input.forEach(entry => {
        const dist = getManhattanDist(entry.sensor, entry.beacon);
        // How far we have to travel to get to the correct line.
        const yDist = Math.abs(lineNo - entry.sensor.y);
        if (yDist <= dist) {
            const xExpansion = dist - yDist;
            const x0 = Math.max(entry.sensor.x - xExpansion, 0);
            const x1 = Math.min(entry.sensor.x + xExpansion, xmax);
            knownNoBeaconPos.add({ x0, x1 });
        }
    });
    const consolidated = consolidate([...knownNoBeaconPos]);
    return !(consolidated.length === 1 && consolidated[0].x0 === 0 && consolidated[0].x1 === xmax);
}

function part2(input, max) {
    for (let lineNo = 0; lineNo <= max; ++lineNo) {
        if (lineHasUnknownBeacon(input, lineNo, max)) {
            const knownNoBeaconPos = processLine(input, lineNo, 0, max);
            for (let x = 0; x <= max; ++x) {
                if (!knownNoBeaconPos.has(x)) {
                    console.log(`${x}, ${lineNo}`);
                    return x * 4000000 + lineNo;
                }
            }
        }
    }
    return 0;
}

const DAY = 15;

let input = readFromFile(`../inputs/day${DAY}_example.txt`);
console.log("part 1 example = " + part1(input, 10));
console.log("part 2 example = " + part2(input, 20));

input = readFromFile(`../inputs/day${DAY}.txt`);
console.log("part 1 = " + part1(input, 2000000));
console.log("part 2 = " + part2(input, 4000000));
