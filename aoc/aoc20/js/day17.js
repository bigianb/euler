
function formatPos(x, y, z, w)
{
    return ''+x+'_'+y+'_'+z+'_'+w;
}

function parsePos(pos)
{
    let n = pos.split('_');
    return {x: Number(n[0]), y: Number(n[1]), z: Number(n[2]), w: Number(n[3])}
}

function populate(input)
{
    let set = new Set();
    for (let r=0; r<input.length; ++r){
        for (let c=0; c<input[r].length; ++c){
            if (input[r][c] === '#'){
                set.add(formatPos(c,r,0,0));
            }
        }
    }
    return set;
}

function findBbox(set)
{
    let x0, x1, y0, y1, z0, z1, w0, w1;
    let first=true;
    for (let pos of set.values()){
        let {x, y, z, w} = parsePos(pos);
        if (first){
            first=false;
            x0 = x;
            x1 = x;
            y0 = y;
            y1 = y;
            z0 = z;
            z1 = z;
            w0 = w;
            w1 = w;
        }
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        z0 = Math.min(z0, z);
        w0 = Math.min(w0, w);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
        z1 = Math.max(z1, z);
        w1 = Math.max(w1, w);
    }
    return {x0, x1, y0, y1, z0, z1, w0, w1}
}

function countNeighbours(set, x0, y0, z0, w0)
{
    let num = 0;
    for (let x of [x0-1, x0, x0+1]){
        for (let y of [y0-1, y0, y0+1]){
            for (let z of [z0-1, z0, z0+1]){
                for (let w of [w0-1, w0, w0+1]){
                    if (!(x === x0 && y === y0 && z === z0 && w === w0)){
                        if (set.has(formatPos(x,y,z,w))){
                            num++;
                        }
                    }
                }
            }
        }
    }
    return num;
}

function step(set)
{
    let next = new Set();
    let {x0, x1, y0, y1, z0, z1, w0, w1} = findBbox(set);

    for (let x=x0-1; x <= x1+1; ++x){
        for (let y=y0-1; y <= y1+1; ++y){
            for (let z=z0-1; z <= z1+1; ++z){
                for (let w=w0-1; w <= w1+1; ++w){
                    const strPos = formatPos(x, y, z, w);
                    let active = set.has(strPos);
                    let neighbours = countNeighbours(set, x, y, z, w);
                    let nextActive = false;
                    if (!active && neighbours === 3){
                        nextActive = true;
                    }
                    if (active && (neighbours === 2 || neighbours === 3)){
                        nextActive = true;
                    }
                    if (nextActive){
                        next.add(strPos);
                    }
                }
            }
        }
    }
    return next;
}

const example =
[
".#.",
"..#",
"###"
]

let puzzleInput =
[
    "#...#.#.",
    "..#.#.##",
    "..#..#..",
    ".....###",
    "...#.#.#",
    "#.#.##..",
    "#####...",
    ".#.#.##."
]

let set = populate(puzzleInput);
for (let cycle=0; cycle<6; ++cycle){
    set = step(set);
}
console.log(set.size);
