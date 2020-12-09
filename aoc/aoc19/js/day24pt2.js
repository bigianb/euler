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
        return 0;
    }
    if (x==2 && y == 2){
        return getEdgeValue(map.down, edge);
    }
    return map[y][x] === '.' ? 0 : 1;
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
                count += getCellValue(x, 0, map);
            }
            break;
        case 'B':
            for (let x=0; x<5; ++x){
                count += getCellValue(x, 4, map);
            }
            break;
        case 'L':
            for (let y=0; y<5; ++y){
                count += getCellValue(0, y, map);
            }
            break;
        case 'R':
            for (let y=0; y<5; ++y){
                count += getCellValue(4, y, map);
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
    let mapOut=[]
    for(let row=0; row<5; ++row){
        let s=""
        for (let col=0; col<5; ++col){
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
        mapOut.push(s);
    }
    return mapOut;
}



console.log('done');
