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

/*
The first 7 characters will either be F or B;
these specify exactly one of the 128 rows on the plane (numbered 0 through 127).
Each letter tells you which half of a region the given seat is in.
Start with the whole list of rows;
the first letter indicates whether the seat is in the front (0 through 63)
or the back (64 through 127).
The next letter indicates which half of that region the seat is in,
and so on until you're left with exactly one row.

For example, consider just the first seven characters of FBFBBFFRLR:

Start by considering the whole range, rows 0 through 127.
F means to take the lower half, keeping rows 0 through 63.
B means to take the upper half, keeping rows 32 through 63.
F means to take the lower half, keeping rows 32 through 47.
B means to take the upper half, keeping rows 40 through 47.
B keeps rows 44 through 47.
F keeps rows 44 through 45.
The final F keeps the lower of the two, row 44.

The last three characters will be either L or R;
these specify exactly one of the 8 columns of seats on the plane (numbered 0 through 7).
The same process as above proceeds again, this time with only three steps.
L means to keep the lower half, while R means to keep the upper half.

*/
function decodeBoardingPass(pass)
{
    let row=0;
    for (let i=0; i<7; ++i){
        row *= 2;
        if (pass[i] === 'B'){
            row += 1;
        }
    }
    let col=0;
    for (let i=7; i<10; ++i){
        col *= 2;
        if (pass[i] === 'R'){
            col += 1;
        }
    }
    let id = row*8+col;
    return {row, col, id}
}

// row 70, column 7, seat ID 567.
console.log(JSON.stringify(decodeBoardingPass('BFFFBBFRRR')));
console.log(JSON.stringify(decodeBoardingPass('FFFBBBFRRR')));
console.log(JSON.stringify(decodeBoardingPass('BBFFBBFRLL')));

let passes = readFromFile('../inputs/day5.txt');

let maxid=0;
for (let pass of passes){
    let passcode = decodeBoardingPass(pass);
    if (passcode.id > maxid){
        maxid = passcode.id;
    }
}
console.log(maxid);

let seats = Array(maxid+1);
for (let pass of passes){
    let passcode = decodeBoardingPass(pass);
    seats[passcode.id] = 1;
}
for (let i=1; i<maxid; ++i){
    if (seats[i-1] && !seats[i] && seats[i+1]){
        console.log('pass ' + i + ' is a potential');
    }
}
