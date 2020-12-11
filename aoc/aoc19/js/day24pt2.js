const initial = {
    map: [
        "..#.#",
        ".#.##",
        "...#.",
        "...##",
        "#.###"
    ],
    up: null,
    down: null
}

const testInitial = {
    map: [
        "....#",
        "#..#.",
        "#.?##",
        "..#..",
        "#...."
    ],
    up: null,
    down: null
}

function getCellValue(x, y, map, edge)
{
    if (x < 0 || x > 4 || y < 0 || y > 4){
        if (!map.up){
            return 0;
        }
        if (x === -1){
            return getSimpleCellValue(1, 2, map.up);
        }
        if (x === 5){
            return getSimpleCellValue(3, 2, map.up);
        }
        if (y === -1){
            return getSimpleCellValue(2, 1, map.up);
        }
        if (y === 5){
            return getSimpleCellValue(2, 3, map.up);
        }
        console.error('unexpected x or y value');
    }
    if (x==2 && y == 2){
        if (map.down){
            return getEdgeValue(map.down, edge);
        } else {
            return 0;
        }
    }
    return getSimpleCellValue(x, y, map);
}

function getSimpleCellValue(x, y, map)
{
    return map.map[y][x] === '.' ? 0 : 1;
}

function getEdgeValue(map, edge)
{
    if (!map){
        return 0;
    }
    let count=0;
    switch(edge)
    {
        case 'T':
            for (let x=0; x<5; ++x){
                count += getSimpleCellValue(x, 0, map);
            }
            break;
        case 'B':
            for (let x=0; x<5; ++x){
                count += getSimpleCellValue(x, 4, map);
            }
            break;
        case 'L':
            for (let y=0; y<5; ++y){
                count += getSimpleCellValue(0, y, map);
            }
            break;
        case 'R':
            for (let y=0; y<5; ++y){
                count += getSimpleCellValue(4, y, map);
            }
            break;            
    }
    return count;
}

function countNeighbours(x, y, map)
{
    let n = getCellValue(x-1, y, map, 'R');
    n += getCellValue(x+1, y, map, 'L');
    n += getCellValue(x, y-1, map, 'B');
    n += getCellValue(x, y+1, map, 'T');
    return n;
}

function getNextGen(mapIn)
{
    let map = expandMap(mapIn);
    // start at the top
    while (map.up){ map = map.up}
    let mapOut = emptyLevel();
    let newTop = processSingleLevel(map);
    mapOut.map = newTop;
    while (map.down){
        map = map.down;
        let newGen = processSingleLevel(map);
        mapOut.down = {
            map: newGen,
            up: mapOut,
            down: null
        }
        mapOut = mapOut.down;
    }
    return mapOut;
}

function processSingleLevel(mapIn)
{
    let mapOut=[]
    for(let row=0; row<5; ++row){
        let s=""
        for (let col=0; col<5; ++col){
            if (row === 2 && col ===2){
                s += '?'
            } else {
                let cv = getCellValue(col, row, mapIn);
                let numNeighbours = countNeighbours(col, row, mapIn);
                if (cv === 1){
                    // A bug dies (becoming an empty space) unless there is exactly one bug adjacent to it.
                    if (numNeighbours === 1){
                        s += '#';
                    } else {
                        s += '.';
                    }
                } else {
                    // An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.
                    if (numNeighbours === 1 || numNeighbours === 2){
                        s += '#';
                    } else {
                        s += '.';
                    }
                }
            }
        }
        mapOut.push(s);
    }
    return mapOut;
}

function countBugs(map)
{
    while (map.up) {map = map.up}
    let count = 0;
    do {
        count += countSingleLevel(map.map);
        map = map.down;
    } while (map);
    return count;
}

function countSingleLevel(map)
{
    let count = 0;
    for (let r=0; r<5; ++r){
        for (let c=0; c<5; ++c){
            if (r != 2 || c != 2){
                if (map[r][c] === '#'){
                    ++count;
                }
            }
        }
    }
    return count;
}

function emptyLevel()
{
    return {
        map: [
            ".....",
            ".....",
            "..?..",
            ".....",
            "....."
        ],
        up: null,
        down: null
    }
}

function expandMap(map)
{
    while (map.up){
        map = map.up;
    }
    let topBugs = countSingleLevel(map.map);
    if (topBugs > 0){
        map.up = emptyLevel();
        map.up.down = map;
    }
    while (map.down){
        map = map.down;
    }
    let bottomBugs = countSingleLevel(map.map);
    if (bottomBugs > 0){
        map.down = emptyLevel();
        map.down.up = map;
    }
    return map;
}

function doPart2(map, time)
{
    let iteration = 0;
    do {
        map = getNextGen(map);
        ++iteration;
    } while (iteration < time)
    return map;
}

let map = doPart2(initial, 200);
while (map.up){map = map.up};
console.log(countBugs(map));

