let testInput = {
    earliestDepart: 939,
    busString: "7,13,x,x,59,x,31,19"
}

let puzzleInput = {
    earliestDepart: 1015292,
    busString: "19,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,743,x,x,x,x,x,x,x,x,x,x,x,x,13,17,x,x,x,x,x,x,x,x,x,x,x,x,x,x,29,x,643,x,x,x,x,x,37,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,23"
}

function convertBusString(input)
{
    input.buses = [];
    for (let bus of input.busString.split(',')){
        if (bus !=='x'){
            input.buses.push(Number(bus));
        }
    }
}

function convertBusStringPt2(input)
{
    input.pt2 = [];
    let i=0;
    for (let bus of input.busString.split(',')){
        if (bus !=='x'){
            input.pt2.push({time: Number(bus), id: i});
        }
        ++i;
    }
}

function findEarliestBus(input)
{
    let bestDelta = 10000;
    let bestBusId = -1;
    for (let busId of input.buses){
        let x = input.earliestDepart / busId;
        let delta = Math.ceil(x) * busId - input.earliestDepart;
        if (delta < bestDelta){
            bestDelta = delta;
            bestBusId = busId;
        }
    }
    return {bestBusId, bestDelta}
}

function findAlignment(input)
{
    // Buses are all prime numbers, so no common factors between them.
    // That means the repeat frequency between them is fixed and simple.
    // If bus 1 and 2 repeat at t=x then they repeat at nx only.
    let delta = input.pt2[0].time;
    let t = delta;
    for (let i=1; i<input.pt2.length; ++i)
    {
        let offset = input.pt2[i].id;
        let busTime = input.pt2[i].time;
        while ((t + offset) % busTime !== 0){
            t += delta;
        }
        delta *= busTime;
    }
    return t;
}

convertBusString(testInput);
convertBusString(puzzleInput);
let earliestBus = findEarliestBus(puzzleInput)
console.log(JSON.stringify(earliestBus));
console.log("" + earliestBus.bestBusId * earliestBus.bestDelta);

convertBusStringPt2(testInput);
let t = findAlignment(testInput)
console.log("" + t);

convertBusStringPt2(puzzleInput);
t = findAlignment(puzzleInput)
console.log("" + t);
