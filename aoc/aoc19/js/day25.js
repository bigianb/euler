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

function runUntilInput(machine)
{
    do {
        machine.run();
        let rows = machine.takeAsciiOutput();
        for (let row of rows){
            console.log(row);
        }
    } while (!machine.wantsInput());
}

const prog = readFromFile('../inputs/day25.txt');

let machine = new IntMachine(prog);

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

runUntilInput(machine);

let bootstrap = [
"south",
"take spool of cat6",
"west",
"take space heater",
"south",
"take shell",
"north",
"north",
"take weather machine",
"west",
//"take giant electromagnet"
"south",
// avoid photons
"south",
"take space law space brochure",
//"west", // infinite loop here
"north",
"east",
"take candy cane",
"west",
"north",
"east",
"north",
"west",
"west",
"take whirled peas",
"east", "east", "south", "south", "east",
// back to passages
"east", "south",
"take hypercube",
"south", "south",
"drop space law space brochure",
"drop space heater",
"drop whirled peas",
"drop spool of cat6",
"east"
]

/*
 
    
*/

for (let command of bootstrap)
{
    console.log("> " + command);
    machine.pushAsciiLine(command);
    runUntilInput(machine);
}

rl.prompt();

rl.on('line', (line) => {
  
    machine.pushAsciiLine(line);
    runUntilInput(machine);
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
