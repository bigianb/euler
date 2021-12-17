const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    return fileData.split(/\n/).map(line => line.trim().split('').map(n => Number(n)));
}

function buildNodes(input)
{
    let nodeArray = [];
    const xmax = input[0].length;
    const ymax = input.length;
    for (let y=0; y<ymax; ++y){
        let row = [];
        for(let x=0; x<xmax; ++x){
            row.push({bestCost: Infinity, cost: input[y][x], children: [], goal: false});
        }
        nodeArray.push(row);
    }
    for (let y=0; y<ymax; ++y){
        for(let x=0; x<xmax; ++x){
            let node = nodeArray[y][x];
            // Down, Right, Up, left
            if (y < ymax - 1){
                node.children.push(nodeArray[y+1][x]);
            }
            if (x < xmax - 1){
                node.children.push(nodeArray[y][x+1]);
            }
            if (y > 0){
                node.children.push(nodeArray[y-1][x]);
            }
            
            if (x > 0){
                node.children.push(nodeArray[y][x-1]);
            }
        }
    }
    nodeArray[ymax-1][xmax-1].goal = true;
    return nodeArray;
}

// https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
function djikstra(nodes)
{
    nodes[0][0].bestCost = 0;
    let flatnodes = [].concat(...nodes);
    // I'm not sure about storing nodes themseleves in the set, so I'll store indices
    let Q = new Set(flatnodes.map((v, i) => {v.idx = i; return i}));
    while(Q.size > 0){
        let u = undefined;
        Q.forEach(idx => {
            const node = flatnodes[idx];
            if (!u){
                u = node;
            } else {
                if (node.bestCost < u.bestCost){
                    u = node;
                }
            }
        });
        Q.delete(u.idx);
        u.children.forEach(child => {
            if (Q.has(child.idx)){
                let newCost = u.bestCost + child.cost;
                if (newCost < child.bestCost){
                    child.bestCost = newCost;
                }
            }
        });
    }
    return flatnodes[flatnodes.length-1].bestCost;
}

function solve1(input)
{
    let nodes = buildNodes(input);
    let cost = djikstra(nodes);
    return cost;
}

function expandInput(input)
{
    let expandedInput = [];

    const xmax = input[0].length;
    const ymax = input.length;

    for(let y=0; y<ymax*5; ++y){
        let row = [];
        for (let x=0; x<xmax*5; ++x){
            row.push(0);
        }
        expandedInput.push(row);
    }

    for(let y=0; y<ymax; ++y){
        for (let x=0; x<xmax; ++x){
            let val = input[y][x];
            for (let blocky=0; blocky<5; ++blocky){
                let rowVal = val;
                for (let blockx=0; blockx<5; ++blockx){
                    expandedInput[y+blocky*ymax][x+blockx*xmax] = rowVal;
                    ++rowVal;
                    if (rowVal > 9){rowVal=1;}
                }
                ++val;
                if (val > 9){val=1;}
            }
        }
    }

    return expandedInput;
}

function solve2(input)
{
    let expandedInput = expandInput(input);
    return solve1(expandedInput);
}

let input = readFromFile('./inputs/day15_example.txt');
console.log("day 15 part 1 example = " + solve1(input));
console.log("day 15 part 2 example = " + solve2(input));

input = readFromFile('./inputs/day15.txt');
console.log("day 15 part 1 = " + solve1(input));
console.log("day 15 part 2 = " + solve2(input));
