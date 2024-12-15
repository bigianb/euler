const fs = require('fs');


/*
If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
*/
function part1_bruteForce(stones, blinks=25){
    for (let blink=0; blink < blinks; ++blink){
        let newStones = [];
        for (let stone of stones){
            if (stone === 0){
                newStones.push(1);
            } else {
                const sstone = ''+stone;
                if ((sstone.length & 1) === 0){
                    newStones.push(parseInt(sstone.substring(0, sstone.length / 2)));
                    newStones.push(parseInt(sstone.substring(sstone.length / 2)));
                } else {
                    newStones.push(stone * 2024);
                }
            }
        }
        stones = newStones;
    }
    return stones.length;
}

// top down dynamic programming.
function part1(stones, totalBlinks=25){
    
    let memo = new Map();

    const doBlinks = (stone, blinks) => {
        if (blinks === 0){
            return 1;
        }

        const key = `${stone}_${blinks}`;
        if (memo.has(key)){
            return memo.get(key);
        }

        if (stone === 0){
            const ans = doBlinks(1, blinks - 1);
            memo.set(key, ans);
            return ans;
        }
        const sstone = ''+stone;
        if ((sstone.length & 1) === 0){
            const s1 = parseInt(sstone.substring(0, sstone.length / 2));
            const s2 = parseInt(sstone.substring(sstone.length / 2));
            const ans = doBlinks(s1, blinks - 1) + doBlinks(s2, blinks - 1);
            memo.set(key, ans);
            return ans;
        } else {
            const ans = doBlinks(stone * 2024, blinks - 1);
            memo.set(key, ans);
            return ans;
        }
    }

    let sum = 0;
    for (let s of stones){
        sum += doBlinks(s, totalBlinks);
    }
    return sum;
}

function part2(stones){
    return part1(stones, 75)
}

console.log(part1([125, 17]));
console.log(part1([9759, 0, 256219, 60, 1175776, 113, 6, 92833]));
console.log(part2([125, 17]));
console.log(part2([9759, 0, 256219, 60, 1175776, 113, 6, 92833]));  
                                                            
