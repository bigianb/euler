/*
 - It is a six-digit number.
 - The value is within the range given in your puzzle input.
 - Two adjacent digits are the same (like 22 in 122345).
 - Going from left to right, the digits never decrease;
      they only ever increase or stay the same (like 111123 or 135679).
*/

function isCandidate(num)
{
    let sval = ""+num;
    let foundAdjacent=false;
    let adjacentCount=0;
    let alwaysIncrease=true;
    let c = sval[0];
    for (let i=1; i<6; ++i){
        if (c == sval[i]){
            ++adjacentCount;
        } else {
            if (1 == adjacentCount){
                foundAdjacent=true;
            }
            adjacentCount=0;
        }
        if (sval[i] < c){
            alwaysIncrease = false;
        }
        c = sval[i];
    }
    if (1 == adjacentCount){
        foundAdjacent=true;
    }
    return foundAdjacent && alwaysIncrease;
}

let candidates = [];
for (let i = 136760; i <= 595730; ++i){
    if (isCandidate(i)){
        candidates.push(i);
    }
}

console.log(candidates.length)
