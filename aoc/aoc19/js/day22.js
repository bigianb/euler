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
            if (cutVal > 0){
                let newDeck = Array(deck.length);
                
            } else {

            }
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
