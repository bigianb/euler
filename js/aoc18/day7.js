let data = [
"Step B must be finished before step K can begin.",
"Step F must be finished before step I can begin.",
"Step T must be finished before step U can begin.",
"Step R must be finished before step Z can begin.",
"Step N must be finished before step S can begin.",
"Step X must be finished before step Y can begin.",
"Step I must be finished before step Y can begin.",
"Step K must be finished before step L can begin.",
"Step U must be finished before step J can begin.",
"Step G must be finished before step L can begin.",
"Step W must be finished before step A can begin.",
"Step H must be finished before step Q can begin.",
"Step M must be finished before step L can begin.",
"Step P must be finished before step L can begin.",
"Step L must be finished before step A can begin.",
"Step V must be finished before step Y can begin.",
"Step Q must be finished before step Y can begin.",
"Step Z must be finished before step J can begin.",
"Step O must be finished before step D can begin.",
"Step Y must be finished before step A can begin.",
"Step J must be finished before step E can begin.",
"Step A must be finished before step E can begin.",
"Step C must be finished before step E can begin.",
"Step D must be finished before step E can begin.",
"Step S must be finished before step E can begin.",
"Step B must be finished before step R can begin.",
"Step U must be finished before step O can begin.",
"Step X must be finished before step I can begin.",
"Step C must be finished before step S can begin.",
"Step O must be finished before step S can begin.",
"Step J must be finished before step D can begin.",
"Step O must be finished before step E can begin.",
"Step Z must be finished before step O can begin.",
"Step J must be finished before step C can begin.",
"Step P must be finished before step Y can begin.",
"Step X must be finished before step S can begin.",
"Step O must be finished before step Y can begin.",
"Step J must be finished before step A can begin.",
"Step H must be finished before step C can begin.",
"Step P must be finished before step D can begin.",
"Step Z must be finished before step S can begin.",
"Step T must be finished before step Z can begin.",
"Step Y must be finished before step C can begin.",
"Step X must be finished before step H can begin.",
"Step R must be finished before step Y can begin.",
"Step T must be finished before step W can begin.",
"Step L must be finished before step O can begin.",
"Step G must be finished before step Z can begin.",
"Step H must be finished before step P can begin.",
"Step I must be finished before step U can begin.",
"Step H must be finished before step V can begin.",
"Step N must be finished before step Y can begin.",
"Step Q must be finished before step E can begin.",
"Step H must be finished before step D can begin.",
"Step P must be finished before step O can begin.",
"Step T must be finished before step I can begin.",
"Step W must be finished before step V can begin.",
"Step K must be finished before step M can begin.",
"Step R must be finished before step W can begin.",
"Step B must be finished before step T can begin.",
"Step U must be finished before step A can begin.",
"Step N must be finished before step H can begin.",
"Step F must be finished before step U can begin.",
"Step Q must be finished before step O can begin.",
"Step Y must be finished before step S can begin.",
"Step V must be finished before step O can begin.",
"Step W must be finished before step C can begin.",
"Step Y must be finished before step J can begin.",
"Step T must be finished before step V can begin.",
"Step N must be finished before step D can begin.",
"Step U must be finished before step Q can begin.",
"Step A must be finished before step C can begin.",
"Step U must be finished before step M can begin.",
"Step Q must be finished before step S can begin.",
"Step P must be finished before step V can begin.",
"Step B must be finished before step Z can begin.",
"Step W must be finished before step Q can begin.",
"Step L must be finished before step S can begin.",
"Step I must be finished before step P can begin.",
"Step G must be finished before step P can begin.",
"Step L must be finished before step C can begin.",
"Step K must be finished before step A can begin.",
"Step D must be finished before step S can begin.",
"Step I must be finished before step H can begin.",
"Step R must be finished before step M can begin.",
"Step Q must be finished before step D can begin.",
"Step K must be finished before step O can begin.",
"Step I must be finished before step C can begin.",
"Step N must be finished before step O can begin.",
"Step R must be finished before step X can begin.",
"Step P must be finished before step C can begin.",
"Step B must be finished before step Y can begin.",
"Step G must be finished before step E can begin.",
"Step L must be finished before step V can begin.",
"Step W must be finished before step Y can begin.",
"Step C must be finished before step D can begin.",
"Step M must be finished before step J can begin.",
"Step F must be finished before step N can begin.",
"Step T must be finished before step Q can begin.",
"Step I must be finished before step E can begin.",
"Step A must be finished before step D can begin."
];

let testData = 
[
"Step C must be finished before step A can begin.",
"Step C must be finished before step F can begin.",
"Step A must be finished before step B can begin.",
"Step A must be finished before step D can begin.",
"Step B must be finished before step E can begin.",
"Step D must be finished before step E can begin.",
"Step F must be finished before step E can begin."
];

//data = testData;

function getPrePost(desc)
{
    let pre = desc[5];
    let post = desc[36];
    return {pre:pre, post:post}
}

function findSteps(theData)
{
    let steps = {}
    for (let row of theData){
        let nodedef = getPrePost(row);
        steps[nodedef.pre] = 1;
        steps[nodedef.post] = 1;
    }
    return Object.keys(steps)
}

// returns the steps that are ready to execute
function getReadySteps(theData, allSteps, finishedSteps)
{
    let notReadySteps = {};
    for (row of theData){
        let nodedef = getPrePost(row);
        if (!finishedSteps.includes(nodedef.post)){
            // haven't done this step yet
            if (!finishedSteps.includes(nodedef.pre)){
                notReadySteps[nodedef.post] = 1;
            }
        }
    }
    let readySteps=[];
    for (let step of allSteps){
        if (!notReadySteps[step] && !finishedSteps.includes(step)){
            readySteps.push(step);
        }
    }
    return readySteps;
}

function doStep1()
{
    let allSteps = findSteps(data);
    let finished = [];

    var ready;
    do {
        ready = getReadySteps(data, allSteps, finished);
        if (ready.length > 0){
            ready.sort();
            finished += ready[0];
        } 
    } while (ready.length > 0);
    return finished;
}

console.log("step 1: " + doStep1());

