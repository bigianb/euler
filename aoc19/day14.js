const test1 = [
"157 ORE => 5 NZVS",
"165 ORE => 6 DCFZ",
"44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL",
"12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ",
"179 ORE => 7 PSHF",
"177 ORE => 5 HKGWZ",
"7 DCFZ, 7 PSHF => 2 XJWVT",
"165 ORE => 2 GPVTF",
"3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT"
]

const test2 = [
"9 ORE => 2 A",
"8 ORE => 3 B",
"7 ORE => 5 C",
"3 A, 4 B => 1 AB",
"5 B, 7 C => 1 BC",
"4 C, 1 A => 1 CA",
"2 AB, 3 BC, 4 CA => 1 FUEL"
]

const theInput = [
"1 RNQHX, 1 LFKRJ, 1 JNGM => 8 DSRGV",
"2 HCQGN, 1 XLNC, 4 WRPWG => 7 ZGVZL",
"172 ORE => 5 WRPWG",
"7 MXMQ, 1 SLTF => 3 JTBLB",
"1 DSRGV => 4 SLZF",
"2 HDVD, 32 LFKRJ => 4 FCZQD",
"9 LNRS, 18 WKMWF => 8 RNQRM",
"12 MWSGQ => 9 DCKC",
"6 SLTF, 5 XLNC => 1 KFBX",
"4 QNRZ, 1 QHLF, 15 FWSK => 9 SFJC",
"9 KFBX, 15 RPKGX, 2 QNRZ => 6 LFKRJ",
"8 SFJC, 6 ZQGL, 4 PFCGF => 3 THPCT",
"2 RNQHX, 4 PFCGF, 1 ZQGL => 6 LNRS",
"195 ORE => 4 PTHDF",
"3 FJKSL => 7 FWSK",
"12 KBJW, 9 MWSGQ => 9 WKMWF",
"3 XLNC => 5 RPKGX",
"188 ORE => 7 FJKSL",
"6 ZNPNM, 3 KHXPM, 3 TJXB => 2 HSDS",
"1 DGKW, 17 XLNC => 1 PFCGF",
"2 VRPJZ, 3 DSRGV => 5 MWSGQ",
"12 BJBQP, 5 XLNC => 4 HCQGN",
"1 GFCGF => 3 HDVD",
"18 TJXB, 2 THPCT, 1 WPGQN => 4 KHXPM",
"1 ZGVZL => 1 JNGM",
"3 ZGVZL => 8 KBJW",
"12 GFCGF => 8 BJBQP",
"7 MXMQ, 18 WRPWG => 9 XLNC",
"13 ZGVZL, 1 QNRZ => 6 RNQHX",
"5 HRBG, 16 QNRZ => 9 WPGQN",
"5 SFJC, 1 PFCGF, 1 KHXPM => 5 FXDMQ",
"1 KBJW, 5 BNFV, 16 XLNC, 1 JNGM, 1 PFCGF, 1 ZNPNM, 4 FXDMQ => 5 VBWCM",
"5 ZGVZL, 5 LFKRJ => 9 QHLF",
"14 JTBLB => 5 VRPJZ",
"4 FWSK => 9 RXHC",
"2 HRBG, 3 FCZQD => 8 DRLBG",
"9 KLXC, 23 VBWCM, 44 VPTBL, 5 JRKB, 41 PFCGF, 4 WBCRL, 20 QNRZ, 28 SLZF => 1 FUEL",
"1 DRLBG => 5 VPTBL",
"13 LNRS => 7 ZNPNM",
"3 WPGQN => 9 TJXB",
"5 GFCGF, 3 HCQGN => 5 ZQGL",
"1 KHXPM, 4 LMCSR, 1 QHLF, 4 WKMWF, 1 DGKW, 3 KBRM, 2 RNQRM => 4 KLXC",
"171 ORE => 8 ZJGSJ",
"3 ZJGSJ => 3 MXMQ",
"124 ORE => 5 SLTF",
"22 KHXPM, 10 FXDMQ => 6 KBRM",
"2 FCZQD => 8 LMCSR",
"7 DCKC, 8 HSDS, 7 PFCGF, 16 ZNPNM, 3 RNQRM, 3 WKMWF, 2 WBCRL, 14 RXHC => 7 JRKB",
"7 DCKC, 2 MWSGQ => 3 BNFV",
"2 ZQGL => 9 DGKW",
"22 WRPWG => 6 HRBG",
"22 KBJW, 1 KFBX, 1 THPCT => 6 WBCRL",
"4 WRPWG, 1 RXHC, 21 FWSK => 8 QNRZ",
"1 PTHDF => 8 GFCGF"
]

function parseInput(input)
{
    let output = {}
    for (let line of input){
        let sides = line.split(' => ');
        let lhs = sides[0].trim().split(', ');
        let rhs = sides[1].trim().split(' ');
        let key = rhs[1].trim();
        let outputAmount = Number(rhs[0]);
        let obj = {key, outputAmount};
        obj.inputs = [];
        for (let components of lhs){
            let parts = components.trim().split(' ');
            let amount = Number(parts[0].trim());
            let key = parts[1].trim();
            obj.inputs.push({key, amount});
        }
        output[key] = obj;
    }
    return output;
}

function calculateOreFor(dag, key, amount, inventory)
{
//    console.log('calculate ore for ' + amount + ' of ' + key)
    if (key === 'ORE'){
        return amount;
    }
    if (key in inventory && inventory[key]){
        let amountInInventory = inventory[key];
        if (amountInInventory >= amount){
            amountInInventory -= amount;
            inventory[key] = amountInInventory;
            return 0;
        }
        amount -= amountInInventory;
        inventory[key] = 0;
    }
    let recipe = dag[key];
    let multiplier = 1;
    if (amount > recipe.outputAmount){
        multiplier = Math.ceil(amount / recipe.outputAmount);
    }
    let oreAmount = 0;
    for (let input of recipe.inputs){
        oreAmount += calculateOreFor(dag, input.key, input.amount*multiplier, inventory);
    }
    let outputAmount = recipe.outputAmount * multiplier;
    // oreAmount will give recipe.outputAmount of key
    if (amount < outputAmount){
        // some left over
        inventory[key] = outputAmount - amount;
    }
 //   console.log("     " + amount + " of " + key + " needs " + oreAmount + " ore");
 //   console.log(' inventory: ' + JSON.stringify(inventory));
    return oreAmount;
}

let dag = parseInput(theInput);

let orePer1 = calculateOreFor(dag,'FUEL', 1, {})
console.log(orePer1);

let startFuel = Math.floor(1000000000000 / orePer1);
console.log(startFuel);


let fuelRequired = startFuel;
let ore=0;
while (ore < 1000000000000){
    let oreUsed = calculateOreFor(dag,'FUEL', fuelRequired, {});
    console.log('used ' + oreUsed + ' for ' + fuelRequired + ' fuel');
    let delta = 1000000000000 - oreUsed;
    console.log('delta ' + delta);
    let extra = Math.floor(delta / orePer1);
    if (extra == 0){extra = 1}
    fuelRequired += extra;
    ore = oreUsed;
}

console.log(ore);
