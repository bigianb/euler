const assert = require('assert');

let transitions = {
"#..#.": "#",
"#...#": "#",
".##.#": "#",
"#....": ".",
"..#..": ".",
"#.##.": ".",
"##...": "#",
"##.#.": "#",
".#.##": "#",
".#.#.": ".",
"###..": ".",
"#..##": ".",
"###.#": ".",
"...##": ".",
"#.#..": "#",
".....": ".",
"#####": "#",
"..###": ".",
"..#.#": "#",
"....#": ".",
"...#.": "#",
"####.": "#",
".#...": "#",
"#.#.#": "#",
".##..": "#",
"..##.": ".",
"##..#": ".",
".#..#": "#",
"##.##": "#",
".####": ".",
".###.": "#",
"#.###": "."
};

let initial_state= "#....#.#....#....#######..##....###.##....##.#.#.##...##.##.#...#..###....#.#...##.###.##.###...#..#"

// ...#x => # will result in a left extension by 1
// ....# => # will result in a left extensino by 2 .. but we don't have that pattern.
//
// Thus the maximum spread to the left is the number of generations

function testEqual(plants, target)
{
    // Assumes arrays are equal length
    for (let i=0; i<plants.length; ++i){
        if (plants[i] != target[i]){
            return false;
        }
    }
    return true;
}

function evolve(numGenerations, initial, transitions)
{
    const leftOffset = numGenerations + 3;
    let plants = []
    for (let i=0; i<leftOffset; ++i){
        plants.push('.');
    }
    for(let c of initial_state){
        plants.push(c);
    }
    for (let i=0; i<leftOffset; ++i){
        plants.push('.');
    }
    
    for (let g=0; g<numGenerations; ++g){
        let target=['.','.']
        for (let i=0; i<plants.length-5; ++i){
            let key = plants.slice(i, i+5).join('');
            let val = transitions[key];
            if(!val){
                console.error(key)
                val = '.';
            }
            target.push(val);
        }
        target.push('.')
        target.push('.')
        target.push('.')
         plants = target;
    }
    
    let sum=0;
    for (let i=0; i<plants.length; ++i){
        let potNo = i - leftOffset;
        if (plants[i] == '#'){
            sum += potNo;
        }
    }

    return sum;
}

console.log(evolve(100, initial_state, transitions));

/*
You realize that 20 generations aren't enough. After all, these plants will need to last another 1500 years to even reach your timeline, not to mention your future.

After fifty billion (50000000000) generations, what is the sum of the numbers of all pots which contain a plant?
*/

function testOffset(plants, target)
{
    // test if target is plants shifted to the right by 1.
    for (let i=0; i<plants.length-1; ++i){
        if (plants[i] != target[i+1]){
            return false;
        }
    }
    return true;
}

function evolveHuge(numHugeGenerations, initial, transitions)
{
    const numGenerations = 100;
    const leftOffset = numGenerations + 3;
    let plants = []
    for (let i=0; i<leftOffset; ++i){
        plants.push('.');
    }
    for(let c of initial_state){
        plants.push(c);
    }
    for (let i=0; i<leftOffset; ++i){
        plants.push('.');
    }
    let g=0;
    for (; g<numGenerations; ++g){
        let target=['.','.']
        for (let i=0; i<plants.length-5; ++i){
            let key = plants.slice(i, i+5).join('');
            let val = transitions[key];
            if(!val){
                console.error(key)
                val = '.';
            }
            target.push(val);
        }
        target.push('.')
        target.push('.')
        target.push('.');
        if (testOffset(plants, target)){
            console.log('found shift only at gen ' + g)
            break;
        }
        plants = target;
    }
    
    // plants is at g-1
    // g is plants >> 1 etc
    let shifts = numHugeGenerations - g;

    let sum=0;
    for (let i=0; i<plants.length; ++i){
        let potNo = i - leftOffset + shifts;
        if (plants[i] == '#'){
            sum += potNo;
        }
    }

    return sum;
}

console.log(evolveHuge(50000000000, initial_state, transitions));
