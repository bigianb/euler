const input = [1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,13,1,19,1,19,10,23,2,10,23,27,1,27,6,31,1,13,31,35,1,13,35,39,1,39,10,43,2,43,13,47,1,47,9,51,2,51,13,55,1,5,55,59,2,59,9,63,1,13,63,67,2,13,67,71,1,71,5,75,2,75,13,79,1,79,6,83,1,83,5,87,2,87,6,91,1,5,91,95,1,95,13,99,2,99,6,103,1,5,103,107,1,107,9,111,2,6,111,115,1,5,115,119,1,119,2,123,1,6,123,0,99,2,14,0,0];

function run(noun, verb)
{
    let mem = [...input];

    mem[1] = noun;
    mem[2] = verb;

    let i=0;
    while(mem[i] != 99){
        switch(mem[i]){
            case 1:
                mem[mem[i+3]] = mem[mem[i+1]] + mem[mem[i+2]];
                break;
            case 2:
                mem[mem[i+3]] = mem[mem[i+1]] * mem[mem[i+2]];
                break;
            default:
                console.error('unknown opcode: ' + mem[i] + ' at index ' + i);
        }
        i += 4;
    }
    return mem[0]
}

console.log('part 1: ' + run(12, 2));

let done=false;
for (let noun=0; noun < 100 && !done; ++noun){
    for (let verb=0; verb < 100 && !done; ++verb){
        let val = run(noun, verb);
        if (val == 19690720){
            done=true;
            console.log('part 2: ' + (100*noun + verb));
        }
    }
} 

console.log('done');
