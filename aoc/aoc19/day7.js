const program_in = [3, 8, 1001, 8, 10, 8, 105, 1, 0, 0, 21, 46, 55, 68, 89, 110, 191, 272, 353, 434, 99999, 3, 9, 1002, 9, 3, 9, 1001, 9, 3, 9, 102, 4, 9, 9, 101, 4, 9, 9, 1002, 9, 5, 9, 4, 9, 99, 3, 9, 102, 3, 9, 9, 4, 9, 99, 3, 9, 1001, 9, 5, 9, 102, 4, 9, 9, 4, 9, 99, 3, 9, 1001, 9, 5, 9, 1002, 9, 2, 9, 1001, 9, 5, 9, 1002, 9, 3, 9, 4, 9, 99, 3, 9, 101, 3, 9, 9, 102, 3, 9, 9, 101, 3, 9, 9, 1002, 9, 4, 9, 4, 9, 99, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 99, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 99, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 99, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 99, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 99];

function run(mem, input, pc) {
    let output = [];

    let inputIdx = 0;
    let doBreak=false;
    let status='halted';
    while (mem[pc] != 99 && !doBreak) {
        let oplen = 1;

        let fullCode = mem[pc];
        let opcode = fullCode % 100;
        let sFullcode = new Intl.NumberFormat('en-GB', {
            minimumIntegerDigits: 5,
            maximumFractionDigits: 0,
            useGrouping: false
        }).format(fullCode);

        // 1 == immediate mode
        let aMode = sFullcode[0];
        let bMode = sFullcode[1];
        let cMode = sFullcode[2];

        switch (opcode) {
            case 0:
                oplen = 4;
                break;
            case 1: {
                let c = cMode == '1' ? mem[pc + 1] : mem[mem[pc + 1]];
                let b = bMode == '1' ? mem[pc + 2] : mem[mem[pc + 2]];
                mem[mem[pc + 3]] = c + b;
                oplen = 4;
            }
            break;
        case 2: {
            let c = cMode == '1' ? mem[pc + 1] : mem[mem[pc + 1]];
            let b = bMode == '1' ? mem[pc + 2] : mem[mem[pc + 2]];
            mem[mem[pc + 3]] = c * b;
            oplen = 4;
        }
        break;
        case 3:
            if (input.length <= inputIdx){
                status = 'needInput';
                oplen=0;
                doBreak = true;
            } else {
                mem[mem[pc + 1]] = input[inputIdx];
                inputIdx += 1;
                oplen = 2;
            }
            break;
        case 4: {
            let c = cMode == '1' ? mem[pc + 1] : mem[mem[pc + 1]];
            output.push(c);
            status = 'output';
            doBreak = true;
            oplen = 2;
        }
        break;
        case 5: {
            // jump if true
            let c = cMode == '1' ? mem[pc + 1] : mem[mem[pc + 1]];
            let b = bMode == '1' ? mem[pc + 2] : mem[mem[pc + 2]];
            if (c == 0) {
                oplen = 3;
            } else {
                oplen = b - pc;
            }
        }
        break;
        case 6: {
            // jump if false
            let c = cMode == '1' ? mem[pc + 1] : mem[mem[pc + 1]];
            let b = bMode == '1' ? mem[pc + 2] : mem[mem[pc + 2]];
            if (c != 0) {
                oplen = 3;
            } else {
                oplen = b - pc;
            }
        }
        break;
        case 7: {
            /*
            Opcode 7 is less than: if the first parameter is less than the second parameter,
            it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
            */
            oplen = 4;
            let c = cMode == '1' ? mem[pc + 1] : mem[mem[pc + 1]];
            let b = bMode == '1' ? mem[pc + 2] : mem[mem[pc + 2]];
            if (c < b) {
                mem[mem[pc + 3]] = 1;
            } else {
                mem[mem[pc + 3]] = 0;
            }
        }
        break;
        case 8: {
            /*
            Equals
            */
            oplen = 4;
            let c = cMode == '1' ? mem[pc + 1] : mem[mem[pc + 1]];
            let b = bMode == '1' ? mem[pc + 2] : mem[mem[pc + 2]];
            if (c == b) {
                mem[mem[pc + 3]] = 1;
            } else {
                mem[mem[pc + 3]] = 0;
            }
        }
        break;
        default:
            console.error('unknown opcode: ' + opcode + ' at index ' + pc);
        }
        pc += oplen;
    }
    return {pc, status, output};
}

function runPhase(program, phaseArray) {
    let power = 0;
    for (let stage = 0; stage < 5; ++stage) {
        let out = run([...program], [phaseArray[stage], power], 0);
        power = out.output[0];
    }
    return power;
}

function runPhaseLoop(program, phaseArray) {
    let amps = [];
    for (let amp=0;amp<5; ++amp){
        amps[amp] = {pc:0}
        amps[amp].mem = [...program];
        amps[amp].input = [phaseArray[amp]]
    }

    let power = 0;
    let halted = false;
    while (!halted){
        for (let stage = 0; stage < 5; ++stage) {
            let amp = amps[stage];
            amp.input.push(power);
            let status = run(amp.mem, amp.input, amp.pc);

            amp.input=[];
            amp.pc = status.pc;
            if (status.status == 'halted'){
                halted = true;
            } else {
                if (status.status == 'needInput'){
                    console.error('input underflow');
                }
                power = status.output[0];
            }
        }
    }
    return power;
}

console.log(runPhase([3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0], [4, 3, 2, 1, 0]));

function getAllPermutations(input) {
    let results = [];

    if (input.length === 1) {
        return [input];
    }

    for (let i in input) {
        let copy = [...input];
        let firstVal = copy.splice(i, 1)[0];
        let innerPerms = getAllPermutations(copy);
        for (let innerPerm of innerPerms) {
            results.push([firstVal, ...innerPerm]);
        }
    }
    return results;
}

function runCombos() {
    let maxPower=0;
    for (let perm of getAllPermutations([0, 1, 2, 3, 4])){
        console.log('running ' + JSON.stringify(perm))
        let power = runPhase(program_in, perm);
        maxPower = Math.max(maxPower, power);
    }
    console.log('max power = ', maxPower);
}

runCombos();

function runPart2(){
    let maxPower = 0;
    for (let perm of getAllPermutations([5, 6, 7, 8, 9])){
        console.log('running ' + JSON.stringify(perm))
        let power = runPhaseLoop(program_in, perm);
        maxPower = Math.max(maxPower, power);
    }
    console.log('max power part 2 = ', maxPower);
}
runPart2();

console.log('done');