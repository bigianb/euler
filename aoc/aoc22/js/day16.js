const fs = require('fs');

function readFromFile(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\r?\n/);
    return lines.map(line => {
        const parts = line.split(';');
        return {
            valve: parts[0].substring(6, 8),
            flowRate: Number.parseInt(parts[0].substring(23)),
            nextValves: parts[1].substring(23).trim().split(', ')
        };
    });
}

function part2(input) {
    
    return 0;
}

// Makes a copy so we don't mutate the input.
function buildGraph(input)
{
    let graph = {};
    input.forEach(line => {graph[line.valve] = {...line, visited: false, on: false}});
    return graph;
}

function sumFlowrates(graph)
{
    let total = 0;
    Object.values(graph).forEach(node => {
        if (node.on){
            const thisFlow = node.flowRate * (30 - node.minuteTurnedOn);
            total += thisFlow;
        }
    })
    return total;
}

function part1(input) {
    let graph = buildGraph(input);
    let minute = 0;
    while (minute < 30){

    }
    return sumFlowrates(graph);
}

const DAY = 16;

let input = readFromFile(`../inputs/day${DAY}_example.txt`);
console.log("part 1 example = " + part1(input));
console.log("part 2 example = " + part2(input));

input = readFromFile(`../inputs/day${DAY}.txt`);
console.log("part 1 = " + part1(input));
console.log("part 2 = " + part2(input));
