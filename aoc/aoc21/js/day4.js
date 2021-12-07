const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    const numbers = lines[0].split(',');
    let blocks = []
    let numBlocks = (lines.length - 1)/6
    for (let blockNo=0; blockNo < numBlocks; ++blockNo){
        blocks.push(parseBlock(lines, blockNo*6 + 2));
    }
    return {numbers, blocks};
}

function parseBlock(lines, startLine)
{
    let block = {rows: [], cols: [], solved: false}
    for (let rowNo=0; rowNo<5; ++rowNo){
        block.rows.push(lines[startLine+rowNo].trim().split(/\s+/));
    }
    // Also figure out columns now to make it easier later.
    for (let colNo=0; colNo<5; ++colNo){
        let col = [];
        for (let rowNo=0; rowNo<5; ++rowNo){
            col.push(block.rows[rowNo][colNo]);
        }
        block.cols.push(col);
    }
    return block;
}

function markBlock(number, block)
{
    // Remove number from rows and cols.
    block.rows = block.rows.map(row => row.reduce((prev, cellVal) => {return cellVal === number ? prev : [...prev, cellVal]}, []));
    block.cols = block.cols.map(row => row.reduce((prev, cellVal) => {return cellVal === number ? prev : [...prev, cellVal]}, []));

    // Check if complete (i.e. if any of the rows or cols are empty)
    block.solved = block.solved ||  block.rows.reduce((prev, val) => prev || val.length === 0, false);
    block.solved = block.solved ||  block.cols.reduce((prev, val) => prev || val.length === 0, false);
}

function calcSum(block)
{
    let sum = 0;
    block.rows.forEach(row => {
        sum = row.reduce((prev, val) => prev + Number(val), sum)
    })
    return sum;
}

function solve(numbers, blocks)
{
    let winners = []
    numbers.forEach(number => {
        blocks.forEach(block => {
            if (!block.solved){
                markBlock(number, block);
                if (block.solved){
                    winners.push(Number(number) * calcSum(block));
                }
            }
        })
    });


    return winners;
}

let {numbers, blocks} = readFromFile('./inputs/day4_example.txt');
let solution = solve(numbers, blocks);
console.log("day 1 part 1 example = " + solution[0]);
console.log("day 1 part 2 example = " + solution[solution.length -1]);

let x = readFromFile('./inputs/day4.txt');
solution = solve(x.numbers, x.blocks);
console.log("day 1 part 1 example = " + solution[0]);
console.log("day 1 part 2 example = " + solution[solution.length -1]);
