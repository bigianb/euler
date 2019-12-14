
const puzInput = [
    "##.###.#.......#.#....#....#..........#.",
    "....#..#..#.....#.##.............#......",
    "...#.#..###..#..#.....#........#......#.",
    "#......#.....#.##.#.##.##...#...#......#",
    ".............#....#.....#.#......#.#....",
    "..##.....#..#..#.#.#....##.......#.....#",
    ".#........#...#...#.#.....#.....#.#..#.#",
    "...#...........#....#..#.#..#...##.#.#..",
    "#.##.#.#...#..#...........#..........#..",
    "........#.#..#..##.#.##......##.........",
    "................#.##.#....##.......#....",
    "#............#.........###...#...#.....#",
    "#....#..#....##.#....#...#.....#......#.",
    ".........#...#.#....#.#.....#...#...#...",
    ".............###.....#.#...##...........",
    "...#...#.......#....#.#...#....#...#....",
    ".....#..#...#.#.........##....#...#.....",
    "....##.........#......#...#...#....#..#.",
    "#...#..#..#.#...##.#..#.............#.##",
    ".....#...##..#....#.#.##..##.....#....#.",
    "..#....#..#........#.#.......#.##..###..",
    "...#....#..#.#.#........##..#..#..##....",
    ".......#.##.....#.#.....#...#...........",
    "........#.......#.#...........#..###..##",
    "...#.....#..#.#.......##.###.###...#....",
    "...............#..#....#.#....#....#.#..",
    "#......#...#.....#.#........##.##.#.....",
    "###.......#............#....#..#.#......",
    "..###.#.#....##..#.......#.............#",
    "##.#.#...#.#..........##.#..#...##......",
    "..#......#..........#.#..#....##........",
    "......##.##.#....#....#..........#...#..",
    "#.#..#..#.#...........#..#.......#..#.#.",
    "#.....#.#.........#............#.#..##.#",
    ".....##....#.##....#.....#..##....#..#..",
    ".#.......#......#.......#....#....#..#..",
    "...#........#.#.##..#.#..#..#........#..",
    "#........#.#......#..###....##..#......#",
    "...#....#...#.....#.....#.##.#..#...#...",
    "#.#.....##....#...........#.....#...#..."
]

let test1Field =[
    "......#.#.",
    "#..#.#....",
    "..#######.",
    ".#.#.###..",
    ".#..#.....",
    "..#....#.#",
    "#..#....#.",
    ".##.#..###",
    "##...#..#.",
    ".#....####",
    ]

let test2Field = [
    ".#..#",
    ".....",
    "#####",
    "....#",
    "...##"
]

function findBestPosition(starMap)
{
    const w = starMap[0].length;
    const h = starMap.length;
    let bestCandidate = {visible: []}
    for (let x=0; x<w; ++x){
        for (let y=0; y<h; ++y){
            if (starMap[y][x] == '#'){
                console.log('evaluating position ' + x + ', ' + y)
                let visible = evaluatePos(x, y, starMap);
                console.log(' ....... ' + visible.length + ' can be seen')
                if (visible.length > bestCandidate.visible.length){
                    bestCandidate = {x, y, visible}
                }
            }
        }
    }
    return bestCandidate;
}

function evaluatePos(x, y, starMap)
{
    let visible = []
    const w = starMap[0].length;
    const h = starMap.length;
    for (let xx=0; xx<w; ++xx){
        for (let yy=0; yy<h; ++yy){
            if (!(x === xx && y === yy) && starMap[yy][xx] == '#'){
                // can we see xx,yy from x,y
                if (isVisible(x, y, xx, yy, starMap)){
                    visible.push({x:xx, y:yy})
//                    console.log('can see ' + xx + ', ' + yy + ' to make a total of ' + numVisible);
                } else {
//                    console.log('' + xx+ ', ' + yy + ' is hidden')
                }
            }
        }
    }
    return visible;
}

function isVisible(x, y, xx, yy, starMap)
{
    let visible = true;

    let x0 = Math.min(x, xx);
    let x1 = Math.max(x, xx);
    let y0 = Math.min(y, yy);
    let y1 = Math.max(y, yy);

    for (let xxx=x0; xxx<=x1; ++xxx){
        for (let yyy=y0; yyy<=y1; ++yyy){
            if (!(x === xxx && y === yyy) && !(xx === xxx && yy === yyy) && starMap[yyy][xxx] == '#'){
                // does xxx, yyy sit on the line between x, y and xx, yy
                if ( x === xx && x === xxx){
                    visible = false;
//                    console.log('cannot see ' + xx + ', ' + yy + ' from ' + x + ', ' + y + ' due to ' + xxx + ', ' + yyy);
                 
                } else {
                    let gradient = (yy - y) / (xx - x);
                    let gradient2 = (yyy - y) / (xxx - x);
                    if (gradient === gradient2){
//                        console.log('cannot see ' + xx + ', ' + yy + ' from ' + x + ', ' + y + ' due to ' + xxx + ', ' + yyy);
                        visible = false;
                    }
                }
            }
        }
    }
    return visible;
}

function calculateAngles(candidate)
{
    for (let asteroid of candidate.visible){
        let dx = asteroid.x - candidate.x;
        let dy = candidate.y - asteroid.y;      // +ve dy is up
        asteroid.angle = getAngle(-dx, -dy);
    }
}

function getAngle(x, y){
    let alpha = Math.atan2(y, x) * 180 / Math.PI;
    
    let alphaCW = -alpha;
    let alphaNorth0 = alphaCW - 90;
    if (alphaNorth0 < 0){
        alphaNorth0 += 360;
    }
    if (alphaNorth0 > 360){
        alphaNorth0 -= 360;
    }
    return alphaNorth0;
}

console.log(findBestPosition(test1Field));

const part2Input = [
    ".#..##.###...#######",
    "##.############..##.",
    ".#.######.########.#",
    ".###.#######.####.#.",
    "#####.##.#.##.###.##",
    "..#####..#.#########",
    "####################",
    "#.####....###.#.#.##",
    "##.#################",
    "#####.##.###..####..",
    "..######..##.#######",
    "####.##.####...##..#",
    ".#####..#.######.###",
    "##...#.##########...",
    "#.##########.#######",
    ".####.#.###.###.#.##",
    "....##.##.###..#####",
    ".#.#.###########.###",
    "#.#.#.#####.####.###",
    "###.##.####.##.#..##"
]

let bestCandidate = findBestPosition(puzInput);
console.log(bestCandidate);
calculateAngles(bestCandidate);
bestCandidate.visible.sort(function(a, b) {
    return a.angle - b.angle;
  });

  console.log(bestCandidate.visible[0]);
console.log(bestCandidate.visible[1]);
console.log(bestCandidate.visible[199]);

console.log('done');
