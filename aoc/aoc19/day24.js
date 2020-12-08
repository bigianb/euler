const initial = [
"..#.#",
".#.##",
"...#.",
"...##",
"#.###"
];

function getCellValue(x, y, map)
{
    if (x < 0 || x > 4 || y < 0 || y > 4){
        return 0;
    }
    return map[y][x] === '.' ? 0 : 1;
}

function countNeighbours(x, y, map)
{
    let n = getCellValue(x-1, y, map);
    n += getCellValue(x+1, y, map);
    n += getCellValue(x, y-1, map);
    n += getCellValue(x, y+1, map);
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

function getBDRating(map)
{
    let val=0;
    for (let y=4; y>=0; --y){
        for (let x=4; x >= 0; --x){
            let cv = getCellValue(x, y, map);
            val = val << 1;
            val = val | cv;
        }
    }
    return val;
}

function doPart1()
{
    let set={}
    let done=false;
    let map = initial;
    while (!done){
        let bd = getBDRating(map);
        if (bd in set){
            done=true;
            console.log(bd);
        }
        set[bd]=1;
        map = getNextGen(map);
    }
}

doPart1();

console.log('done');
