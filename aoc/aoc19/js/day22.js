const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    let output = []
    for (let line of lines){
        if (line != ""){
            output.push(processLine(line));
        }
    }
    return output;
}

function processLine(line)
{
    let parts = line.trim().split(' ');
    return {opcode: parts[0], args: parts.slice(1)}
}

function buildFactoryDeck(deckSize)
{
    let deck = Array(deckSize);
    for (let i=0; i<deckSize; ++i){
        deck[i] = i;
    }
    return deck;
}

function applyShuffleStep(step, deck)
{
    switch(step.opcode)
    {
        case 'cut':
            let cutVal = Number(step.args[0]);
            // works for both +ve and -ve cutVal
            deck = deck.slice(cutVal).concat(deck.slice(0, cutVal));
            break;
        case 'deal':
            if (step.args[0] === 'into'){
                deck.reverse();
            } else {
                let increment = Number(step.args[2]);
                let newDeck = Array(deck.length);
                for (let sourceIdx in deck){
                    let tgtIndex = (sourceIdx * increment) % deck.length;
                    newDeck[tgtIndex] = deck[sourceIdx];
                }
                deck = newDeck;
            }
            break;
        default:
            console.error('unknown opcode ' + step.opcode);
    }
    return deck;
}

function shuffle(steps, deckSize)
{
    let deck = buildFactoryDeck(deckSize);
    for (let step of steps){
        deck = applyShuffleStep(step, deck);
    }
    return deck;
}

let exampleShuffle = readFromFile('../inputs/day22_example.txt');
let deck = shuffle(exampleShuffle, 10);
console.log(JSON.stringify(deck));

let data = readFromFile('../inputs/day22.txt');
deck = shuffle(data, 10007);
for (let i in deck){
    if (deck[i] === 2019){
        console.log('card 2019 is at position ' + i);
    }
}

/* Part 2

When you get back, you discover that the 3D printers have combined their power to create for you a single,
giant, brand new, factory order deck of 119315717514047 space cards.

Finally, a deck of cards worthy of shuffling!

You decide to apply your complete shuffle process (your puzzle input) to the deck 101741582076661 times in a row.

You'll need to be careful, though - one wrong move with this many cards and you might overflow your entire ship!

After shuffling your new, giant, factory order deck that many times, what number is on the card that ends up in position 2020?

*/

function gcdExtended(a, b) {
    let x = 0, y = 1, u = 1, v = 0;
    while (a !== 0) {
        let q = Math.floor(b / a);
        [x, y, u, v] = [u, v, x - u * q, y - v * q];
        [a, b] = [b % a, a];
    }
    return [b, x, y];
}

function modInverse(a, m) {
    const [g, x] = gcdExtended(a, m);
    if (g !== 1) throw('Bad mod inverse')
    return (x + m) % m;
}

function modDiv(a, b, modulus) {
    return Number(BigInt(a) * BigInt(modInverse(b, modulus)) % BigInt(modulus));
}

function mulMod(a,b,modulus) {
    return Number(BigInt(a) * BigInt(b) % BigInt(modulus))
}

function solvePt2(input, deckSize, targetPos, repeats) {
    let [a, b] = input.reduceRight(([a, b], step) => {
        if (step.opcode === 'cut'){
            return [a, ((b + Number(step.args[0])) % deckSize + deckSize) % deckSize];
        } else if (step.opcode === 'deal' && step.args[0] === 'into'){
            return [(deckSize - a) % deckSize, (2*deckSize - b - 1) % deckSize]
        } else {
            const increment = Number(step.args[2]);
            return [modDiv(a, increment, deckSize), modDiv(b, increment, deckSize) ];
        }
    }, [1, 0]);
    while (repeats) {
      if (repeats % 2) targetPos = (mulMod(targetPos,a,deckSize) + b) % deckSize;
      [a, b] = [mulMod(a,a,deckSize), (mulMod(a,b,deckSize) + b) % deckSize];
      repeats = Math.floor(repeats / 2);
    }
    return targetPos;
  }
  
  let input = readFromFile('../inputs/day22.txt');
  let part2 = solvePt2(input, 119315717514047, 2020, 101741582076661);
  console.log('' + part2);

