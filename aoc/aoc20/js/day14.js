const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    let output = []
    for (let line of lines){
        if (line != ""){
            output.push(line);
        }
    }
    return output;
}

function executev1(instructions)
{
    let orMask = BigInt(0);
    let andMask = BigInt(0);
    let mem = {}
    for (let inst of instructions)
    {
        let parts = inst.split(" = ");
        if (parts[0] === 'mask'){
            andMask = BigInt('0b0' + parts[1].replace(/X/g, '1'));
            orMask = BigInt('0b0' + parts[1].replace(/X/g, '0'));
        } else {
            let addr = parts[0].slice(4, -1);
            let val = BigInt(parts[1]);
            val &= andMask;
            val |= orMask;
            mem[addr] = val;
        }
    }
    let total =BigInt(0);
    for (let v of Object.values(mem)){
        total += v;
    }

    return total;
}


function applyFloat(mask, strRep)
{
    let floatIdx=0;
    let modMask = "";
    for (let i=0; i<mask.length; ++i){
        if (mask[i] === 'X'){
            modMask += strRep[floatIdx++];
        } else {
            modMask += mask[i];
        }
    }
    return modMask;
}

function addrDecode(addr, mask)
{
    let addrInStr = BigInt(addr).toString(2);
    while (addrInStr.length < mask.length){
        addrInStr = '0' + addrInStr;
    }

    let addrMaskStr = '';
    for (let i=0; i<mask.length; ++i)
    {
        if (mask[i] === '0'){
            addrMaskStr += addrInStr[i];
        } else {
            addrMaskStr += mask[i];
        }
    }


    let floatingBits = 0;
    for (let c of mask){
        if (c === 'X'){
            floatingBits += 1;
        }
    }
    let addrs = [];
    for (let i=0; i<2**floatingBits; ++i){
        let strRep = i.toString(2);
        while (strRep.length < floatingBits){
            strRep = '0' + strRep;
        }
        let addrStr = applyFloat(addrMaskStr, strRep);
        addrs.push(BigInt('0b0'+addrStr));
    }
    return addrs;
}

function executev2(instructions)
{
    let mask=''
    let mem = {}
    for (let inst of instructions)
    {
        let parts = inst.split(" = ");
        if (parts[0] === 'mask'){
            mask = parts[1];
        } else {
            let addrs = addrDecode(parts[0].slice(4, -1), mask);
            for (let addr of addrs){
                let val = BigInt(parts[1]);
                mem[addr] = val;
            }
        }
    }
    let total =BigInt(0);
    for (let v of Object.values(mem)){
        total += v;
    }

    return total;
}

let sum=executev1(readFromFile('../inputs/day14.txt'));
console.log("sum = " + sum);

sum=executev2(readFromFile('../inputs/day14.txt'));
console.log("sum = " + sum);