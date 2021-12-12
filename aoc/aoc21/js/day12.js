const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    return fileData.split(/\n/).map(line => line.trim().split('-'));
}

function buildNodes(edges)
{
    let nodes = {}

    edges.forEach(edge => {
        edge.forEach(nodeName => {
            if (!nodes[nodeName]){
                nodes[nodeName] = {name: nodeName, isUpper: nodeName === nodeName.toUpperCase(), connections: []}
            }
        });
        nodes[edge[0]].connections.push(nodes[edge[1]]);
        nodes[edge[1]].connections.push(nodes[edge[0]]);
    });

    return nodes;
}

function findPaths(node, visited, numPaths)
{
    if (node.name === 'end'){
        return numPaths + 1;
    }
    let nextVisited = new Set(visited);
    if (!node.isUpper){
        nextVisited.add(node.name);
    }
    node.connections.forEach(connection => {
        if (!nextVisited.has(connection.name)){
            numPaths = findPaths(connection, nextVisited, numPaths);
        }
    })
    return numPaths;
}

function solve1(edges)
{
    nodes = buildNodes(edges);
    let start = nodes['start'];
    let numPaths = findPaths(start, new Set(), 0);
    return numPaths;
}

function findPaths2(node, visited, numPaths, doneDouble)
{
    if (node.name === 'end'){
        return numPaths + 1;
    }
    let nextVisited = new Set(visited);
    if (!node.isUpper){
        nextVisited.add(node.name);
    }
    node.connections.forEach(connection => {
        if (!nextVisited.has(connection.name)){
            numPaths = findPaths2(connection, nextVisited, numPaths, doneDouble);
        } else if (!doneDouble && connection.name !== 'start'){
            numPaths = findPaths2(connection, nextVisited, numPaths, true);
        }
    })
    return numPaths;
}

function solve2(edges)
{
    nodes = buildNodes(edges);
    let start = nodes['start'];
    let numPaths = findPaths2(start, new Set(), 0, false);
    return numPaths;
}

let edges = readFromFile('./inputs/day12_example.txt');
console.log("day 12 part 1 example = " + solve1(edges));
console.log("day 12 part 2 example = " + solve2(edges));

edges = readFromFile('./inputs/day12.txt');
console.log("day 12 part 1 = " + solve1(edges));
console.log("day 12 part 2 = " + solve2(edges));
