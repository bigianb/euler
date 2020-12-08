
function run(mem, input, pc, relativeBase, inputIdx) {
    let output = [];

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
                let c = readVal(cMode, mem, pc+1, relativeBase);
                let b = readVal(bMode, mem, pc+2, relativeBase);
                writeVal(aMode, mem, pc+3, relativeBase, c+b);
                oplen = 4;
            }
            break;
        case 2: {
            let c = readVal(cMode, mem, pc+1, relativeBase);
            let b = readVal(bMode, mem, pc+2, relativeBase);
            writeVal(aMode, mem, pc+3, relativeBase, c*b);
            oplen = 4;
        }
        break;
        case 3:
            if (input.length <= inputIdx){
                status = 'needInput';
                oplen=0;
                doBreak = true;
            } else {
                writeVal(cMode, mem, pc+1, relativeBase, input[inputIdx]);
                inputIdx += 1;
                oplen = 2;
            }
            break;
        case 4: {
            let c = readVal(cMode, mem, pc+1, relativeBase);
            output.push(c);
            status = 'output';
            doBreak = true;
            oplen = 2;
        }
        break;
        case 5: {
            // jump if true
            let c = readVal(cMode, mem, pc+1, relativeBase);
            let b = readVal(bMode, mem, pc+2, relativeBase);
            if (c == 0) {
                oplen = 3;
            } else {
                oplen = b - pc;
            }
        }
        break;
        case 6: {
            // jump if false
            let c = readVal(cMode, mem, pc+1, relativeBase);
            let b = readVal(bMode, mem, pc+2, relativeBase);
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
            let c = readVal(cMode, mem, pc+1, relativeBase);
            let b = readVal(bMode, mem, pc+2, relativeBase);
            if (c < b) {
                writeVal(aMode, mem, pc+3, relativeBase, 1);
            } else {
                writeVal(aMode, mem, pc+3, relativeBase, 0);
            }
        }
        break;
        case 8: {
            /*
            Equals
            */
            oplen = 4;
            let c = readVal(cMode, mem, pc+1, relativeBase);
            let b = readVal(bMode, mem, pc+2, relativeBase);
            if (c == b) {
                writeVal(aMode, mem, pc+3, relativeBase, 1);
            } else {
                writeVal(aMode, mem, pc+3, relativeBase, 0);
            }
        }
        break;
        case 9:
            {
                let c = readVal(cMode, mem, pc+1, relativeBase);
                relativeBase += c;
                oplen = 2;
            }
            break;
        default:
            console.error('unknown opcode: ' + opcode + ' at index ' + pc);
        }
        pc += oplen;
    }
    return {pc, status, output, relativeBase, inputIdx};
}

function readVal(mode, mem, idx, relativeBase)
{
    let rval=undefined;
    if (mode === '0'){
        rval = mem[mem[idx]];
    } else if (mode === '1'){
        rval = mem[idx];
    } else if (mode === '2'){
        rval = mem[mem[idx] + relativeBase];
    } else {
        console.log('unknown mode ' + mode);
        rval = null;
    }
    if (rval === undefined){
        rval = 0;
    }
    return rval;
}

function writeVal(mode, mem, idx, relativeBase, val)
{
    if (mode === '0'){
        mem[mem[idx]] = val;
    } else if (mode === '1'){
        console.error('attempt to write immediate address');
    } else if (mode === '2'){
        mem[mem[idx] + relativeBase] = val;
    } else {
        console.error('unknown mode ' + mode);
    }
}

function runProgram(program, input)
{
    let pc=0;
    let relativeBase=0;
    let done=false;
    let mem = [...program];
    let output = [];
    let inputIdx=0;
    do {
        let out = run(mem, input, pc, relativeBase, inputIdx);
        done = out.status === 'halted';
        pc = out.pc;
        relativeBase = out.relativeBase;
        inputIdx = out.inputIdx;
        output.push(out.output[0]);
    } while (!done);
    return output;
}

function runASCIIProgram(program, inputStr)
{
    let input = [];
    for (let c of inputStr)
    {
        input.push(c.charCodeAt(0));
    }
    return runProgram(program, input);
}

function parseASCIIOutput(out, log)
{
    let rows=[]
    let row = ""
    for (let c of out){
        if (c == 10){
            rows.push(row);
            row = "";
        } else {
            row += String.fromCharCode(c);
        }
    }

    if (log){
        for(let r of rows){
            console.log(r);
        }
    }

    return rows;
}

module.exports = {run, runProgram, runASCIIProgram, parseASCIIOutput}
