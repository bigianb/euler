const fs = require('fs');
const IntMachine = require('./intmachine.js');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const vals = fileData.split(/,/);
    let output = []
    for (let val of vals){
        val = val.trim();
        if (val != ""){
            output.push(Number(val));
        }
    }
    return output;
}

const prog = readFromFile('../inputs/day23.txt');

/*
The computers on the network are standard Intcode computers that communicate by sending packets to each other.
There are 50 of them in total, each running a copy of the same Network Interface Controller (NIC) software (your puzzle input).
The computers have network addresses 0 through 49;
when each computer boots up, it will request its network address via a single input instruction.
Be sure to give each computer a unique network address.
*/

let machines = []
for (let machineId=0; machineId<50; ++machineId){
    let machine = new IntMachine(prog);
    machine.pushInput(machineId);
    machines.push(machine);
}

let prevNat;
let Nat = [0,0]
let done = false;
while (!done){
    let allIdle=true;
    for (let machineId=0; machineId<50; ++machineId){
        let machine = machines[machineId];
        let idle = false;
        if (machine.wantsInput() && !machine.inputAvailable()){
            machine.pushInput(-1);
            idle=true;
        }
        machine.step();
        if (idle && machine.outputBytesAvailable() > 0){
            idle = false;
        }
        while (machine.outputBytesAvailable() > 0 && machine.outputBytesAvailable() < 3){
            // program outputs 3 bytes at a time
            machine.step();
        }
        if (machine.outputBytesAvailable() === 3){
            out = machine.takeOutput();
            let targetId = out[0];
            if (targetId === 255){
                Nat[0] = out[1];
                Nat[1] = out[2];
            } else {
                machines[targetId].pushInput(out[1]);
                machines[targetId].pushInput(out[2]);
            }
        }
        allIdle &= idle;
    }
    if (allIdle){
        if (prevNat && Nat[1] === prevNat[1]){
            console.log(JSON.stringify(Nat));
            break;
        }
        prevNat = [...Nat];
        machines[0].pushInput(Nat[0]);
        machines[0].pushInput(Nat[1]);
    }
}
