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

/*
As you're about to begin construction, four of the Elves offer to help.
"The sun will set soon; it'll go faster if we work together."
Now, you need to account for multiple people working on steps simultaneously.
If multiple steps are available, workers should still begin them in alphabetical order.

Each step takes 60 seconds plus an amount corresponding to its letter: A=1, B=2, C=3, and so on.
So, step A takes 60+1=61 seconds, while step Z takes 60+26=86 seconds.
No time is required between steps.

To simplify things for the example, however, suppose you only have help from one Elf
(a total of two workers) and that each step takes 60 fewer seconds

(so that step A takes 1 second and step Z takes 26 seconds).
Then, using the same instructions as above, this is how each second would be spent:
In this example, it would take 15 seconds for two workers to complete these steps.

With 5 workers and the 60+ second step durations described above,
how long will it take to complete all of the steps?
*/

function durationForStep(step)
{
    return 60 + step.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
}


if (durationForStep('A') != 61 || durationForStep('Z') != 86){
    console.error('durationForStep() is broke')
}

 
// Waits until a worker is free. Returns the new current time. Ignore unassigned workers.
function waitForWorker(workers, currentTime)
{
    let minTime = currentTime+1000;
    for (let worker of workers){
        if (worker.step && worker.completionTime < minTime){
            minTime = worker.completionTime;
        }
    }
    return minTime < currentTime ? currentTime : minTime;
}

// returns the step assigned
function assignWorker(workers, currentTime, steps)
{
    for (let worker of workers){
        if (worker.step){
            steps = steps.filter(item => item != worker.step);
        }
    }

    if (steps.length > 0){
        for (let worker of workers){
            if (worker.completionTime <= currentTime){
                worker.step = steps[0];
                worker.completionTime = currentTime + durationForStep(steps[0]);
                return worker.step;
            }
        }
    }
    return null;
}


function updateFinished(workers, currentTime, finished)
{
    for (let worker of workers){
        if (worker.step && worker.completionTime <= currentTime){
            finished += worker.step;
            worker.step = null;
        }
    }
    return finished;
}

function doStep2()
{
    let workers = []

    for (let worker=0; worker < 5; ++worker){
        workers.push({step: null, completionTime: 0})
    }

    let currentTime=0;
    let allSteps = findSteps(data);
    let finished = [];

    var ready;

    do {
        finished = updateFinished(workers, currentTime, finished);
        ready = getReadySteps(data, allSteps, finished);
        if (ready.length > 0){
            if (!assignWorker(workers, currentTime, ready)){
                currentTime = waitForWorker(workers, currentTime);
            }
        }
    } while (ready.length > 0);
    return currentTime;
}

console.log("step 2 took: " + doStep2());