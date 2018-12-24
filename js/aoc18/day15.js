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

function findUnits(map)
{
    let units = []
    for (let y=0; y<map.length; ++y){
        const row = map[y];
        for (let x=0; x<row.length; ++x){
            let cell = row[x]
            if (cell == 'G' || cell == 'E'){
                units.push({type: cell, x:x, y:y, hp:200, attack:3})
            }
        }
    }
    return units;
}

function findEnemies(units, type)
{
    return units.filter(unit => unit.type != type);
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

function findEnemyInRange(unit, enemies)
{
    for(enemy of enemies){
        if ((unit.y == enemy.y && (unit.x == enemy.x-1 || unit.x == enemy.x+1)) || 
            (unit.x == enemy.x && (unit.y == enemy.y-1 || unit.y == enemy.y+1))
        ){
            return enemy;
        }
    }
    return null;
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

function findClosestTarget(unit, targets, map)
{
    let closest = {targetIdx:0, route: []}
    
    let g = [];
    for (let row of map){
        let gRow = [];
        for (let cell of row){
            let val = cell == '.' ? 1 : 0;
            gRow.push(val);
        }
        g.push(gRow);
    }
    g[unit.y][unit.x]=1;

    var graph = new AStar.Graph(g);
    for (let targetIdx=0; targetIdx < targets.length; ++targetIdx){
        var start = graph.grid[unit.y][unit.x];
        const tgt = targets[targetIdx];
        var end = graph.grid[tgt.y][tgt.x];
        var result = AStar.astar.search(graph, start, end);
        const d = result.length;
        if (d > 0){
            if(closest.route.length == 0 || d.length < closest.route.length){
                closest.route = result;
            }
        }
    }
    return closest;
}

function moveTowardsTarget(unit, closestTarget, map)
{
    if (closestTarget.route.length > 0){
        // the a* library transposes x and y
        unit.x = closestTarget.route[0].y;
        unit.y = closestTarget.route[0].x;
    }
}

function areWeDoneYet(map)
{
    let units = findUnits(map);
    if (units.length < 2){
        return true;
    }
    return findEnemies(units, units[0].type).length == 0;
}

function attack(unit, enemy, map)
{
    enemy.hp -= unit.attack;
    if (enemy.hp <= 0){
        map[enemy.y][enemy.x] = '.';
    }
}

function run(map)
{
    let round=0;
    let units = findUnits(map);
    do {
        for (let unit of units){
            if (unit.hp > 0){
                let enemies = findEnemies(units, unit.type);
                if (enemies.length != 0){
                    let enemyInRange = findEnemyInRange(unit, enemies);
                    if (!enemyInRange){
                        let targets = findTargetSquares(enemies, map);
                        let closestTarget = findClosestTarget(unit, targets, map);
                        moveTowardsTarget(unit, closestTarget, map);
                        enemyInRange = findEnemyInRange(unit, enemies);
                    }
                    if (enemyInRange){
                        attack(unit, enemy, map);
                    }
                }
            }
        }
        // Remove any bodies
        units = units.filter(unit => unit.hp <= 0);
        ++round;
    } while (!areWeDoneYet(map));
    return round;
}

console.log(run(ex1Data));
