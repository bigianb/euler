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

// deck size is prime
