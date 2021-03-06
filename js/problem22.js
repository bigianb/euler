/*
Using names.txt (right click and 'Save Link/Target As...'), a 46K text file containing over five-thousand first names,
begin by sorting it into alphabetical order.
Then working out the alphabetical value for each name, multiply this value by its alphabetical position in the list to obtain a name score.

For example, when the list is sorted into alphabetical order, COLIN,
which is worth 3 + 15 + 12 + 9 + 14 = 53, is the 938th name in the list. So, COLIN would obtain a score of 938 × 53 = 49714.

What is the total of all the name scores in the file?
*/

const fs = require('fs');

function wordval(word, idx)
{
    let chars = Array.from(word);
    let wordval=0;
    for (let c of chars){
        wordval+= (c.charCodeAt(0) - 'A'.charCodeAt(0) + 1);
    }
    wordval *= idx;
    return wordval;
}

function runme()
{
    const data = fs.readFileSync('./p022_names.txt');
    const cleanData = data.toString().replace(/"/g, '');
    const names = cleanData.split(',');
    console.log(`read ${names.length} names`)

    names.sort();

    let sum=0;
    for (let i=0; i<names.length; ++i){
        let name = names[i];
        sum += wordval(name, i+1);
    }
    return sum;
}

console.log(`check 49714 == ${wordval('COLIN', 938)}`);
console.log(`sum is ${runme()}`)
