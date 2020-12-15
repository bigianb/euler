const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    let output = []
    for (let line of lines){
        line = line.trim();
        if (line != ""){
            output.push(line);
        }
    }
    return output;
}

function buildSet(keys)
{
    let keyset = {};
    for (let key of keys){
        keyset[key] = true;
    }
    return keyset;
}

function buildkeyset()
{
    return buildSet("abcdefghijklmnopqrstuvwxyz");
}

function findRoutes(map)
{
    let tilesOfInterest = buildkeyset();
    tilesOfInterest['@'] = true;
    tilesOfInterest['1'] = true;
    tilesOfInterest['2'] = true;
    tilesOfInterest['3'] = true;
    tilesOfInterest['4'] = true;

    let routes = {}
    let y=0;
    for (let row of map){
        let x=0;
        for(let tile of row){
            if (tilesOfInterest[tile]){
                routes[tile] = findDistances({x, y}, map);
            }
            ++x;
        }
        ++y;
    }
    return routes;
}

const keysAndDoors = buildSet("abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ")

// Finds the distance from pos to every interesting tile on the map
function findDistances(pos, map)
{
    let queue = [{pos, dist:0, route: ''}];
    let visited = {}
    let routeInfo = {}

    while (queue.length > 0){
        let {pos, dist, route} = queue.shift();
        let tile = map[pos.y][pos.x];
        if (dist > 0 && keysAndDoors[tile]){
            // If it's not the starting point and is a key or door make a note of
            // how far it was to get here and what route we took.
            routeInfo[tile] = {dist, route};
            // extend the route with this waypoint
            route = route + tile;
        }
        visited[printPos(pos)] = true;

        // Explore each possible direction.
        for (let dir of [[1,0], [0,1], [-1,0], [0,-1]]){
            let nextX = pos.x + dir[0];
            let nextY = pos.y + dir[1];
            if (nextX >= 0 && nextX < map[0].length && nextY >= 0 && nextY < map.length &&
                !visited[printPos({x: nextX, y: nextY})])
            {
                if (map[nextY][nextX] !== '#'){
                    queue.push({pos: {x: nextX, y: nextY}, dist: dist+1, route});
                }
            }
        }
    }
    return routeInfo;
}

function printPos(pos)
{
    return "" + pos.x + "," + pos.y;
}

function solvePt1(map)
{
    let routes = findRoutes(map);

    const allKeys = buildkeyset();
    let keys = [];
    for (let k of Object.keys(routes)){
        if (k in allKeys){
            keys.push(k);
        }
    }

    // maps current tile + keys held to a distance.
    // Starts with @ with no keys.
    let info = {'@': 0}
    for (let keyNo in keys){
        let nextInfo = {}
        for (let infoKey of Object.keys(info)){
            let keysHeld = infoKey.slice(1);
            for (newKey of keys){
                if (!keysHeld.includes(newKey)){
                    // The shortest route from infoKey[0] -> newKey
                    let shortestRoute = routes[infoKey[0]][newKey];
                    // make sure we can reach it
                    let reachable = isReachable(shortestRoute.route, keysHeld);
                    if (reachable){
                        let newDist = info[infoKey] + shortestRoute.dist;
                        let newKeysHeld = keysHeld + newKey;
                        let newInfoKey = newKey + newKeysHeld.split('').sort().join('');
                        if (!nextInfo[newInfoKey] || nextInfo[newInfoKey] > newDist){
                            nextInfo[newInfoKey] = newDist;
                        }
                    }
                }
            }
        }
        info = nextInfo;
    }
    let minDist = 10000000;
    for (let dist of Object.values(info)){
        if (dist < minDist){
            minDist = dist;
        }
    }
    return minDist;
}

// Given a set of keys, can we traverse the route.
function isReachable(route, keysHeld)
{
    for (let tile of route){
        if (!keysHeld.includes(tile.toLowerCase())){
            return false;
        }
    }
    return true;
}

function solvePt2(map)
{
    let routes = findRoutes(map);

    const allKeys = buildkeyset();
    let keys = [];
    for (let k of Object.keys(routes)){
        if (k in allKeys){
            keys.push(k);
        }
    }

    // maps current tile + keys held to a distance.
    // Starts with @ with no keys.
    let info = {'1234': 0}
    for (let keyNo in keys){
        let nextInfo = {}
        for (let infoKey of Object.keys(info)){
            let keysHeld = infoKey.slice(4);
            for (newKey of keys){
                if (!keysHeld.includes(newKey)){
                    for (let bot=0; bot<4; ++bot){
                        let botTile = infoKey[bot];
                        if (routes[botTile][newKey]){
                            // The shortest route from infoKey[bot] -> newKey
                            let shortestRoute = routes[botTile][newKey];
                            // make sure we can reach it
                            let reachable = isReachable(shortestRoute.route, keysHeld);
                            if (reachable){
                                let newDist = info[infoKey] + shortestRoute.dist;
                                let newKeysHeld = keysHeld + newKey;
                                let botArray = infoKey.slice(0, 4).split('');
                                botArray[bot] = newKey; // where the new bot is.
                                let newInfoKey = botArray.join('') + newKeysHeld.split('').sort().join('');
                                if (!nextInfo[newInfoKey] || nextInfo[newInfoKey] > newDist){
                                    nextInfo[newInfoKey] = newDist;
                                }
                            }
                        }
                    }
                }
            }
        }
        info = nextInfo;
    }
    let minDist = 10000000;
    for (let dist of Object.values(info)){
        if (dist < minDist){
            minDist = dist;
        }
    }
    return minDist;
}


const input = readFromFile('../inputs/day18.txt')
let minSteps = solvePt1(input);
console.log(minSteps);

// Edited the input by hand.
const inputpt2 = readFromFile('../inputs/day18_pt2.txt')
minSteps = solvePt2(inputpt2);
console.log(minSteps);
