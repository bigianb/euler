
let moves = [3, 7, 1, 0]

let elf1Idx = 0;
let elf2Idx = 1;

// Step1

const recipiesNum = 793061
while (moves.length < recipiesNum+10){
    const elf1Score = moves[elf1Idx];
    const elf2Score = moves[elf2Idx];
    let newScore = elf1Score + elf2Score;
    if (newScore > 9){
        moves.push(Math.floor(newScore/10));
    }
    moves.push(newScore % 10);

    elf1Idx = (elf1Idx + elf1Score + 1) % moves.length;
    elf2Idx = (elf2Idx + elf2Score + 1) % moves.length;
}

console.log(moves.slice(recipiesNum, recipiesNum+10).join(''));

// Step2
const pattern = '793061'
moves = [3, 7, 1, 0]
let found=false;
elf1Idx = 0;
elf2Idx = 1;
do {
    const elf1Score = moves[elf1Idx];
    const elf2Score = moves[elf2Idx];
    let newScore = elf1Score + elf2Score;
    if (newScore > 9){
        moves.push(Math.floor(newScore/10));
    }
    moves.push(newScore % 10);

    elf1Idx = (elf1Idx + elf1Score + 1) % moves.length;
    elf2Idx = (elf2Idx + elf2Score + 1) % moves.length;

    let substrStart = moves.length-7
    let moveStr = moves.slice(substrStart).join('');
    let idx = moveStr.indexOf(pattern);
    if (idx >= 0){
        found=true;
        console.log('found at '+ (idx + substrStart));
    }
} while (!found)
