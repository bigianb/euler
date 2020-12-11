const intcode = require('./intcode.js');

class IntMachine
{
    constructor(prog)
    {
        this.pc=0;
        this.relativeBase=0;
        this.mem = [...prog];
        this.output = [];
        this.input = []
        this.inputIdx=0;
        this.status='';
    }

    step()
    {
        let out = intcode.run(this.mem, this.input, this.pc, this.relativeBase, this.inputIdx);
        this.pc = out.pc;
        this.relativeBase = out.relativeBase;
        this.inputIdx = out.inputIdx;
        this.status = out.status;
        this.output = this.output.concat(out.output);
    }

    run()
    {
        do {
            this.step()
        } while(this.status !== 'halted' && this.status !== 'needInput');
    }

    pushAsciiLine(val)
    {
        for (let c of val)
        {
            this.input.push(c.charCodeAt(0));
        }
        this.input.push(10);    // newline
    }

    pushInput(val)
    {
        this.input.push(val);
    }

    inputAvailable()
    {
        return this.input.length > this.inputIdx;
    }

    wantsInput()
    {
        return this.status === "needInput";
    }

    outputBytesAvailable()
    {
        return this.output.length;
    }

    takeOutput()
    {
        let out = this.output;
        this.output = [];
        return out;
    }

    takeAsciiOutput()
    {
        let rows=[]
        let row = ""
        for (let c of this.output){
            if (c == 10){
                rows.push(row);
                row = "";
            } else {
                row += String.fromCharCode(c);
            }
        }
        this.output = [];
        return rows;
    }

    isHalted()
    {
        return this.status === 'halted';
    }
}

module.exports = IntMachine
