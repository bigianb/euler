let data = [
"################################",
"##########..#####...############",
"##########.G..####..############",
"########.....##.##.#############",
"####G..#G#.......#.#############",
"#G.....#.GG...G.##.#############",
"#.#...G.......#.##..############",
"###..#.......#####......########",
"######.......#####..G....#######",
"######..GG..######.......#######",
"#####.GG....##.####G......G.####",
"###.............G...........####",
"###.#.........#####G..G....#####",
"###..#.##....#######E.....######",
"########....#########.#######..#",
"#########...#########.#######..#",
"########....#########..##......#",
"#########...#########...#...#.E#",
"#########...#########.......##.#",
"########....E#######.......#####",
"######........#####....E.#######",
"######.......E..E..G.E....######",
"#######.............###....#####",
"#######............####.E...####",
"#######...G....E##....##....####",
"#######...............##########",
"############.E.......###########",
"###########.....#....###########",
"###########.....#....###########",
"###########.....###.############",
"###########.#.##################",
"################################"
];

let ex1Data=[
"#######", 
"#.G...#",
"#...EG#",
"#.#.#G#",
"#..G#E#",
"#.....#",   
"#######"
];

var AStar = require('./astar.js')

function findUnits(map, elfAttackPts)
{
    let units = []
    for (let y=0; y<map.length; ++y){
        const row = map[y];
        for (let x=0; x<row.length; ++x){
            let cell = row[x]
            if (cell == 'G'){
                units.push({type: cell, x:x, y:y, hp:200, attack:3})
            }
            if (cell == 'E'){
                units.push({type: cell, x:x, y:y, hp:200, attack:elfAttackPts})
            }
        }
    }
    return units;
}

function findEnemies(units, type)
{
    return units.filter(unit => unit.type != type && unit.hp > 0);
}


/*
Then, the unit identifies all of the open squares (.) that are in range of each target;
these are the squares which are adjacent (immediately up, down, left, or right)
to any target and which aren't already occupied by a wall or another unit.
Alternatively, the unit might already be in range of a target.
If the unit is not already in range of a target, and there are no open squares which are in range of a target,
the unit ends its turn.

If the unit is already in range of a target, it does not move,
but continues its turn with an attack. Otherwise, since it is not in range of a target, it moves.

To move, the unit first considers the squares that are in range and determines which of those squares
it could reach in the fewest steps
A step is a single movement to any adjacent (immediately up, down, left, or right) open (.) square.
Units cannot move into walls or other units.
The unit does this while considering the current positions of units and does not do any prediction
about where units will be later.
If the unit cannot reach (find an open path to) any of the squares that are in range, it ends its turn.
If multiple squares are in range and tied for being reachable in the fewest steps,
 the square which is first in reading order is chosen.

 After moving (or if the unit began its turn in range of a target), the unit attacks.
*/

function findEnemiesInRange(unit, enemies)
{
    let inRange = []
    for(enemy of enemies){
        if ((unit.y == enemy.y && (unit.x == enemy.x-1 || unit.x == enemy.x+1)) || 
            (unit.x == enemy.x && (unit.y == enemy.y-1 || unit.y == enemy.y+1))
        ){
            inRange.push(enemy);
        }
    }
    return inRange;
}

function isEmpty(x,y,map)
{
    if (y<0 || y>=map.length) return false;
    const row = map[y];
    if (x<0 || x>=row.length) return false;
    return row[x] == '.';
}

function findTargetSquares(enemies, map)
{
    let targets = [];
    for (enemy of enemies){
        if (isEmpty(enemy.x-1, enemy.y, map)){
            targets.push({x:enemy.x-1, y:enemy.y})
        }
        if (isEmpty(enemy.x+1, enemy.y, map)){
            targets.push({x:enemy.x+1, y:enemy.y})
        }
        if (isEmpty(enemy.x, enemy.y-1, map)){
            targets.push({x:enemy.x, y:enemy.y-1})
        }
        if (isEmpty(enemy.x, enemy.y+1, map)){
            targets.push({x:enemy.x, y:enemy.y+1})
        }
    }
    return targets;
}

function findBestMove(unit, targets, map)
{
    let candidates = findClosestTargets(unit.x, unit.y, targets, map);
    if (candidates.length > 1){
        // more than one target has the same distance. Select the one first in reading order.
        let candidateTargets=[]
        for (let c of candidates){
            candidateTargets.push(targets[c.targetIdx]);
        }
        candidateTargets.sort(function(a,b){return (a.y*100+a.x) - (b.y*100+b.x)});
        let newTargets=[];
        newTargets.push(candidateTargets[0]);
        targets = newTargets;
    }
    // There may be more than one closest route.
    // In which case pick the one where the first move is closest in reading order.
    // so, u, l, r, d
    let bestMove = {dist:100000}
    //u
    if (unit.y > 0 && map[unit.y-1][unit.x] == '.'){
        let closest = findClosestTargets(unit.x, unit.y-1, targets, map);
        if (closest.length > 0){
            bestMove.dist = closest[0].route.length;
            bestMove.x = unit.x;
            bestMove.y = unit.y-1;
        }
    }
    //l
    if (unit.x > 0 && map[unit.y][unit.x-1] == '.'){
        let closest = findClosestTargets(unit.x-1, unit.y, targets, map);
        if ((closest.length > 0) && closest[0].route.length < bestMove.dist){
            bestMove.dist = closest[0].route.length;
            bestMove.x = unit.x-1;
            bestMove.y = unit.y;
        }
    }
    //r
    if (unit.x < map[unit.y].length - 1 && map[unit.y][unit.x+1] == '.'){
        let closest = findClosestTargets(unit.x+1, unit.y, targets, map);
        if ((closest.length > 0) && closest[0].route.length < bestMove.dist){
            bestMove.dist = closest[0].route.length;
            bestMove.x = unit.x+1;
            bestMove.y = unit.y;
        }
    }
    //d
    if (unit.y < map.length - 1 && map[unit.y+1][unit.x] == '.'){
        let closest = findClosestTargets(unit.x, unit.y+1, targets, map);
        if ((closest.length > 0) && closest[0].route.length < bestMove.dist){
            bestMove.dist = closest[0].route.length;
            bestMove.x = unit.x;
            bestMove.y = unit.y+1;
        }
    }
    return bestMove;
}

function considerRoute(route, closest)
{
    let len = route.route.length;
    if (closest.length == 0 || closest[0].route.length > len){
        closest = [route];
    } else if (closest[0].route.length == len){
        closest.push(route);
    } 
    return closest;
}

function findClosestTargets(x, y, targets, map)
{
    let closest = [];
    
    let g = [];
    for (let row of map){
        let gRow = [];
        for (let cell of row){
            let val = cell == '.' ? 1 : 0;
            gRow.push(val);
        }
        g.push(gRow);
    }
    g[y][x]=1;

    var graph = new AStar.Graph(g);
    for (let targetIdx=0; targetIdx < targets.length; ++targetIdx){
        const tgt = targets[targetIdx];
        if (x == tgt.x && y == tgt.y){
            closest = considerRoute({targetIdx: targetIdx, route: []}, closest);
            break;
        } else {
            var start = graph.grid[y][x];
            var end = graph.grid[tgt.y][tgt.x];
            var result = AStar.astar.search(graph, start, end);
            const d = result.length;
            if (d > 0){
                closest = considerRoute({targetIdx: targetIdx, route: result}, closest);
            }
        }
    }
    return closest;
}

function moveTowardsTarget(unit, bestMove, map)
{
    if (bestMove.x != undefined){
        map[unit.y][unit.x] = '.';
        unit.x = bestMove.x;
        unit.y = bestMove.y;
        map[unit.y][unit.x] = unit.type;
    }
}

function areWeDoneYet(map)
{
    let units = findUnits(map, 3);
    if (units.length < 2){
        return true;
    }
    return findEnemies(units, units[0].type).length == 0;
}

function findweakestEnemy(enemiesInRange)
{
    let weakest=enemiesInRange[0];
    for(let i=1; i<enemiesInRange.length; ++i){
        let e = enemiesInRange[i];
        if (e.hp < weakest.hp){
            weakest = e;
        } else if (e.hp == weakest.hp){
            if ((e.y*1000+e.x) < (weakest.y*1000+weakest.x)){
                weakest=e;
            }
        }
    }
    return weakest;
}

function attack(unit, enemiesInRange, map)
{
    let enemy = findweakestEnemy(enemiesInRange)
    enemy.hp -= unit.attack;
    if (enemy.hp <= 0){
        map[enemy.y][enemy.x] = '.';
    }
}

// Need a mutable one
function buildMap(map_in)
{
    let map = [];
    for (let row of map_in){
        let gRow = [];
        for (let cell of row){
            gRow.push(cell);
        }
        map.push(gRow);
    }
    return map;
}

function sumHp(units)
{
    let sum=0;
    for (let unit of units){
        sum += unit.hp;
    }
    return sum;
}

function run(map_in, attackPoints)
{
    if (!attackPoints){
        attackPoints=3;
    }
    let map=buildMap(map_in);
    let round=0;
    let units = findUnits(map, attackPoints);
    do {
        ++round;
        units.sort(function(a,b){return (a.y*100+a.x) - (b.y*100+b.x)});
        let partialRound=false;
        for (let i=0; i < units.length; ++i){
            let unit = units[i];
            if (unit.hp > 0){
                let enemies = findEnemies(units, unit.type);
                if (enemies.length != 0){
                    let enemyInRange = findEnemiesInRange(unit, enemies);
                    if (enemyInRange.length == 0){
                        let targets = findTargetSquares(enemies, map);
                        let bestMove = findBestMove(unit, targets, map);
                        moveTowardsTarget(unit, bestMove, map);
                        enemyInRange = findEnemiesInRange(unit, enemies);
                    }
                    if (enemyInRange.length > 0){
                        attack(unit, enemyInRange, map);
                    }
                } else {
                    // done
                    partialRound=true;
                }
            }
        }
        if (partialRound){
            --round;
        }
        // Remove any bodies
        units = units.filter(unit => unit.hp > 0);

    } while (!areWeDoneYet(map));
    let sum = sumHp(units);
    console.log('sum='+sum+', round='+round)
    return {value: round*sum, units: units};
}

console.log(run(ex1Data));

console.log(run(
    ["#######",
    "#G..#E#",
    "#E#E.E#",
    "#G.##.#",
    "#...#E#",
    "#...E.#" ,
    "#######"]
));
console.log(run(
    [
    "#######",
    "#E..EG#",
    "#.#G.E#",
    "#E.##E#",
    "#G..#.#",
    "#..E#.#" ,
    "#######"]
));

/*
Combat ends after 35 full rounds
Goblins win with 793 total hit points left
Outcome: 35 * 793 = 27755
*/

console.log(run(
    [
    "#######",
    "#E.G#.#",
    "#.#G..#",
    "#G.#.G#",
    "#G..#.#",
    "#...E.#" ,
    "#######"]
));

/*
Combat ends after 54 full rounds
Goblins win with 536 total hit points left
Outcome: 54 * 536 = 28944
*/
console.log(run(
    [
    "#######",
    "#.E...#",
    "#.#..G#",
    "#.###.#",
    "#E#G#G#",
    "#...#G#" ,
    "#######"]
));

console.log(run(
    [
    "#########",  
    "#G......#",  
    "#.E.#...#",   
    "#..##..G#",   
    "#...##..#",  
    "#...#...#",  
    "#.G...G.#",  
    "#.....G.#",  
    "#########"]
));

console.log(run(data));

console.log("part 2");

let done=false;
let attackVal=3;
let units = findUnits(data, 3);
let numElves = units.filter(x => x.type == 'E').length;
do {
    ++attackVal;
    let result = run(data, attackVal);
    let numSurvivingElves = result.units.filter(x => x.type == 'E').length;
    if (numSurvivingElves == numElves){
        done=true;
        console.log("attack = " + attackVal);
    }

} while (!done);
