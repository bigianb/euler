const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    let output = []
    for (let line of lines){
        if (line != ""){
            output.push(processLine(line));
        }
    }
    return output;
}

function processLine(line)
{
    let parts = line.split(' bags contain ');
    let contents = parts[1].split(',');
    let obj = {
        holder: parts[0].trim(),
        contents: []
    }
    for (let content of contents){
        content = content.trim();
        if (content !== 'no other bags.'){
            let words = content.split(' ');
            let num = Number(words[0]);
            let bag = words.slice(1, -1).join(' ');
            obj.contents.push({num, bag})
        }
    }
    return obj;
}

function mapFrom(iterable, field)
{
    let map = {}
    for (i of iterable){
        map[i[field]] = i;
    }
    return map;
}

function findParents(map, colour)
{
    let parents = [];
    for (let o of Object.values(map)){
        for (let c of o.contents){
            if (c.bag === colour){
                parents.push(o);
            }
        }
    }
    return parents;
}

function buildContainers(map)
{
    for (let o of Object.values(map)){
        const colour = o.holder;
        o.parents = findParents(map, colour);
    }
}

function collectParentColours(bag, colours={})
{
    for (let p of bag.parents){
        colours[p.holder] = 1;
        collectParentColours(p, colours);
    }

    return colours;
}

function countChildBags(map, bag, multiplier = 1)
{
    let num = 0;
    for (let child of bag.contents){
        num += multiplier * child.num;
        num += countChildBags(map, map[child.bag], multiplier * child.num);
    }
    return num;
}

let rules = readFromFile('../inputs/day7.txt');
//console.log(JSON.stringify(rules));
let map = mapFrom(rules, 'holder');
buildContainers(map);
//console.log(JSON.stringify(map));

let shinyGold = map['shiny gold'];
//console.log(JSON.stringify(shinyGold));
let parentColours = collectParentColours(shinyGold)
//console.log(JSON.stringify(parentColours));
console.log(Object.keys(parentColours).length)

let numBags = countChildBags(map, shinyGold);
console.log(numBags);