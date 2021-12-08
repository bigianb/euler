
const fs = require('fs');

function readTiles(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);

    let tiles = [];
    let tile;
    for (let line of lines){
        line = line.trim();
        if (line.startsWith('Tile')){
            tile = createTile(line);
            tiles.push(tile);
        } else if (line.length > 0){
            tile.rows.push(line);
        }
    }
    return tiles;
}

function createTile(line)
{
    let id = Number(line.slice(5, -1));
    return {id, rows: []}
}

function getBorderValues(rows)
{
    let u = rows[0];
    let d = rows[rows.length-1];
    let r = '';
    let l = '';
    // l and r both read top to bottom.
    for (let row of rows){
        l += row[0];
        r += row[row.length-1];
    }

    return {u, d, l, r}
}

// flip 1 = horiz
// flip 2 = vert
function rotateAndFlip(unrotBorder, rot, flip)
{
    let rotated = {...unrotBorder};
    switch (rot)
    {
        case 1:
            // 90 deg CCW
            rotated.l = unrotBorder.u.split("").reverse().join("");
            rotated.d = unrotBorder.l;
            rotated.r = unrotBorder.d.split("").reverse().join("");
            rotated.u = unrotBorder.r;
        break;

        case 2:
            // 180 deg CCW
            rotated.d = unrotBorder.u.split("").reverse().join("");
            rotated.r = unrotBorder.l.split("").reverse().join("");
            rotated.u = unrotBorder.d.split("").reverse().join("");
            rotated.l = unrotBorder.r.split("").reverse().join("");
        break;

        case 3:
            // 270 deg CCW (90 deg CW)
            rotated.r = unrotBorder.u;
            rotated.d = unrotBorder.r.split("").reverse().join("");
            rotated.r = unrotBorder.d;
            rotated.u = unrotBorder.l.split("").reverse().join("");
        break;
    }
    let flipped = {...rotated};
    switch (flip)
    {
        case 1:
            //horiz
            flipped.r = rotated.l;
            flipped.l = rotated.r;
            flipped.u = rotated.u.split("").reverse().join("");
            flipped.d = rotated.d.split("").reverse().join("");
        break;            
        case 2:
            // vert
            flipped.u = rotated.d;
            flipped.d = rotated.u;
            flipped.l = rotated.l.split("").reverse().join("");
            flipped.r = rotated.r.split("").reverse().join("");
        break;
    }

    return flipped;
}

function createVariants(tiles)
{
    for (let tile of tiles){
        for(let rot=0; rot<4; ++rot){
            // flip vertical and horiz is the same as 180 degree rotation, so ignore that.
            for (let flip=0; flip<3; ++flip){
                const variantId = flip * 4 + rot;
                if (variantId === 0){
                    tile.borders = [];
                    tile.borders[variantId] = getBorderValues(tile.rows);
                } else {
                    tile.borders[variantId] = rotateAndFlip(tile.borders[0], rot, flip);
                }
            }
        }
    }
}

function getTileVariantRows(arrangementVal)
{
    let variantId = arrangementVal.variant;
    let flip = variantId >> 2;
    let rot = variantId % 4;

    let rows = arrangementVal.tile.rows.join('');
    let rotated= [...rows]
    switch (rot)
    {
        case 1:
            // 90 deg CCW
           for(let r=0; r<10; ++r){
               for (let c=0; c<10; ++c){
                   const cx = rows[r*10+c];
                   rotated[(9-c)*10 + r] = cx;
               }
           }
        break;

        case 2:
            // 180 deg CCW
            for(let r=0; r<10; ++r){
                for (let c=0; c<10; ++c){
                    const cx = rows[r*10+c];
                    rotated[(9-r)*10 + (9-c)] = cx;
                }
            }
        break;

        case 3:
            // 270 deg CCW (90 deg CW)
            // row 0 -> col 9
            // col 0 -> row 0
            for(let r=0; r<10; ++r){
                for (let c=0; c<10; ++c){
                    const cx = rows[r*10+c];
                    rotated[c*10 + (9-r)] = cx;
                }
            }
        break;
    }
    let flipped = [...rotated];
    switch (flip)
    {
        case 1:
            //horiz
            for(let r=0; r<10; ++r){
                for (let c=0; c<10; ++c){
                    const cx = rotated[r*10+c];
                    flipped[r*10 + (9-c)] = cx;
                }
            }
        break;            
        case 2:
            // vert
            for(let r=0; r<10; ++r){
                for (let c=0; c<10; ++c){
                    const cx = rotated[r*10+c];
                    flipped[(9-r)*10 + c] = cx;
                }
            }
        break;
    }
    return flipped;
}

function tryPopulate(dim, out, pos, corners, edges, middle)
{
    let tiles = middle;
    const bottomRow =dim * (dim-1);
    const col = pos % dim;
    let isCorner = false;
    let isEdge = false;
    if (pos === 0 || pos === dim-1 || pos === bottomRow || pos === bottomRow + dim - 1){
        isCorner = true;
        tiles = corners;
    } else if (pos < dim || pos >= bottomRow || col === 0 || col === dim - 1){
        isEdge = true;
        tiles = edges;
    }
    for (let tile of tiles)
    {
        let remainingTiles = tiles.filter(t => t.id !== tile.id);
        for (let variant = 0; variant < tile.borders.length; ++variant){
            if (placeable(dim, out, pos, tile, variant)){
                potentialOut = out.slice();
                potentialOut[pos] = {id: tile.id, variant, borders: tile.borders[variant], tile}
                if (pos+1 === dim*dim){
                    return potentialOut;
                }
                let success = false;
                if (isCorner){
                    success = tryPopulate(dim, potentialOut, pos+1, remainingTiles, edges, middle);
                } else if (isEdge){
                    success = tryPopulate(dim, potentialOut, pos+1, corners, remainingTiles, middle);
                } else {
                    success = tryPopulate(dim, potentialOut, pos+1, corners, edges, remainingTiles);
                }
                if (success){
                    return success;
                }
            }
        }
    } 

    return null;
}

function findEdges(tiles)
{
    let edges = {}
    tiles.map(tile => tile.borders.map(border => Object.values(border).map(edge => {
        if (!edges[edge]){edges[edge] = new Set()}
        edges[edge].add(tile);
    })));
    tiles.map(tile => {
        tile.uniqueEdges = Object.values(tile.borders[0]).reduce((prev, cur) => {
            return prev + (edges[cur].size === 1 ? 1 : 0)}, 0);
    })
    return tiles.filter(tile => tile.uniqueEdges === 1);
}

function findCorners(tiles)
{
    return tiles.filter(tile => tile.uniqueEdges === 2);
}

// traverse right and down so only need to check up and left.
function placeable(dim, out, pos, tile, variant)
{
    if (pos === 0){
        return true;
    }
    const uIdx = pos - dim;
    let placeable = true;
    if (uIdx >= 0){
        if (out[uIdx].borders.d !== tile.borders[variant].u){
            placeable = false;
        }
    }
    const col = pos % dim;
    if (col > 0){
        if (out[pos-1].borders.r !== tile.borders[variant].l){
            placeable = false;
        }
    }
    return placeable;
}

function getMap(arrangement, dim)
{
    let map = []
    const stride = dim * 8;
    let i=0;
    for(let row=0; row<dim; ++row){
        for (let col=0; col<dim; ++col){
            let rows = getTileVariantRows(arrangement[i]);
            let ypos = row * 8;
            for (let tr=1; tr<9; ++tr){
                let xpos = col * 8;
                for (let tc=1; tc<9; ++tc){
                    let c = rows[tr*10+tc];
                    map[ypos * stride + xpos] = c;
                    xpos += 1;
                }
                ypos += 1;
            }
            i+=1;
        }
    }
    return map;
}

function printMap(map, dim)
{
    let s='';
    for (let i=0; i<map.length; ++i){
        if (i % (dim * 8) === 0){
            console.log(s);
            s = '';
        }
        s += map[i];
    }
    console.log(s);
}

let tiles = readTiles('./inputs/day20_example.txt');
createVariants(tiles);
let edges = findEdges(tiles);
let corners = findCorners(tiles);
let checksum = corners.reduce((prev, cur) => {return prev * cur.id}, 1);
console.log("Part 1 = " + checksum);

const dim = Math.sqrt(tiles.length);
let middle = tiles.filter(tile => tile.uniqueEdges === 0);
let arrangement= tryPopulate(dim, [], 0, corners, edges, middle);
checksum = arrangement[0].id * arrangement[dim-1].id * arrangement[(dim-1)*dim].id * arrangement[arrangement.length-1].id
console.log("Part 1 = " + checksum);

let map = getMap(arrangement, dim);
printMap(map, dim)
