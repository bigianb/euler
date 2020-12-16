const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    let output = []
    for (let line of lines){
        if (line != ""){
            output.push(line);
        }
    }
    return output;
}

function isChar(c)
{
    return c !== '.' && c !== ' ' && c !== '#';
}

function findPortals(map)
{
    let portals = [];
    const h = map.length;
    const w = map[0].length;
    for (let r=2; r < h -2; ++r){
        for (let c=2; c < w-2; ++c){
            let tgt = {x:c, y:r}
            if (map[r][c] === '.'){
                if (isChar(map[r-1][c]) && isChar(map[r-2][c])){
                    portals.push({tgt, pos: {x: c, y:r-1}, name: map[r-2][c]+map[r-1][c]})
                }
                if (isChar(map[r+1][c]) && isChar(map[r+2][c])){
                    portals.push({tgt, pos: {x: c, y:r+1}, name: map[r+1][c]+map[r+2][c]})
                }
                if (isChar(map[r][c-2]) && isChar(map[r][c-1])){
                    portals.push({tgt, pos: {x: c-1, y:r}, name: map[r][c-2]+map[r][c-1]})
                }
                if (isChar(map[r][c+2]) && isChar(map[r][c+1])){
                    portals.push({tgt, pos: {x: c+1, y:r}, name: map[r][c+1]+map[r][c+2]})
                }
            }
        }
    }
    for (let portal of portals){
        if (portal.pos.x === 1 || portal.pos.x === w-2 || portal.pos.y === 1 || portal.pos.y === h-2){
            portal.outer = true;
        } else {
            portal.outer = false;
        }
    }
    return portals;
}

function buildPortalMap(portalInfos)
{
    let portals = {}
    let start, end
    for (let portalInfo of portalInfos){
        if (portalInfo.name === 'AA'){
            start = portalInfo.tgt;
        } else if (portalInfo.name === 'ZZ'){
            end = portalInfo.tgt;
        } else {
            for (let p of portalInfos){
                if (p.name === portalInfo.name && p !== portalInfo){    
                    let pStr = '' + portalInfo.pos.x + ',' + portalInfo.pos.y;
                    portals[pStr] = {tgt: p.tgt, name: p.name, outer: portalInfo.outer};
                }
            }
        }
    }
    return {start, end, portals};
}

function printPos(pos)
{
    return "" + pos.x + "," + pos.y;
}

function solve(map, portals)
{
    let queue = [{pos: portals.start, dist:0}];
    let visited = {}

    let bestDist = 1000000;
    while (queue.length > 0){
        let {pos, dist} = queue.shift();
        if (pos.x === portals.end.x && pos.y === portals.end.y){
            if (dist < bestDist) {
                bestDist = dist;
            }
        } else {
            visited[printPos(pos)] = dist;

            // Explore each possible direction.
            for (let dir of [[1,0], [0,1], [-1,0], [0,-1]]){
                let nextX = pos.x + dir[0];
                let nextY = pos.y + dir[1];
                let strPos = printPos({x: nextX, y: nextY})
                if (!visited[strPos] || dist < visited[strPos] )
                {
                    if (map[nextY][nextX] !== '#'){
                        let key = ''+nextX+','+nextY;
                        if (portals.portals[key]){
                            const portal = portals.portals[key];
                            let portalTgt = portal.tgt;
                            nextX = portalTgt.x;
                            nextY = portalTgt.y;
                            strPos = printPos({x: nextX, y: nextY})
                        } else if (map[nextY][nextX] !== '.'){
                            console.log(map[nextY][nextX]);
                        }
                        if (map[nextY][nextX] === '.' && (!visited[strPos] || dist < visited[strPos])){
                            queue.push({pos: {x: nextX, y: nextY}, dist: dist+1});
                        }
                    }
                }
            }
        }
    }
    return bestDist;
}


function printLPos(pos, level)
{
    return "" + pos.x + "," + pos.y+','+level;
}

function solvePt2(map, portals)
{
    const maxLevel = Object.keys(portals.portals).length;
    let queue = [{pos: portals.start, level: 0, dist:0}];
    let visited = {}
    let bestDist = 1000000;
    while (queue.length > 0){
        const {pos, level, dist} = queue.shift();
        if (pos.x === portals.end.x && pos.y === portals.end.y && level === 0){
            if (dist < bestDist) {
                bestDist = dist;
            }
        } else {
            visited[printLPos(pos, level)] = dist;

            // Explore each possible direction.
            for (let dir of [[1,0], [0,1], [-1,0], [0,-1]]){
                let nextX = pos.x + dir[0];
                let nextY = pos.y + dir[1];
                let nextLevel = level;
                let strPos = printLPos({x: nextX, y: nextY}, level);
                if (!visited[strPos] || dist < visited[strPos] )
                {
                    if (map[nextY][nextX] !== '#'){
                        const key = ''+nextX+','+nextY;
                        if (portals.portals[key]){
                            const portal = portals.portals[key];
                            if (!portal.outer || level !== 0){
                                nextLevel = portal.outer? level-1 : level+1;
                                let portalTgt = portal.tgt;
                                nextX = portalTgt.x;
                                nextY = portalTgt.y;
                                strPos = printLPos({x: nextX, y: nextY}, nextLevel);
                            }
                        }
                        if (map[nextY][nextX] === '.' && (!visited[strPos] || dist < visited[strPos])){
                            if (level <= maxLevel){
                                queue.push({pos: {x: nextX, y: nextY}, level: nextLevel, dist: dist+1});
                            }
                        }
                    }
                }
            }
        }
    }
    return bestDist;
}

let map = readFromFile('../inputs/day20.txt')
let portalInfos = findPortals(map);
let portals = buildPortalMap(portalInfos);
let best = solvePt2(map, portals);
console.log(''+best);
