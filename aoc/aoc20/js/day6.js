const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    let output = []
    let obj = {numPeople:0, answers: {}, valid: false}
    for (let line of lines){
        line = line.trim();
        if (line === ""){
            if (obj.valid){
                output.push(obj);
            }
            obj = {numPeople:0, answers: {}, valid: false}
        } else {
            obj.numPeople++;
            obj.valid = true;
            obj.answers = addAnswers(obj.answers, line);
        }
    }
    if (obj.valid){
        output.push(obj);
    }
    return output;
}

function addAnswers(obj, line)
{
    for (c of line){
        if (obj[c]){
            obj[c] += 1;
        } else {
            obj[c] = 1;
        }
    }
    return obj;
}

let data = readFromFile('../inputs/day6.txt');
console.log(JSON.stringify(data));
let sum=0;
for (d of data){
    for (c of Object.keys(d.answers)){
        if (d.answers[c] === d.numPeople){
            sum++
        }
    }
}
console.log(sum);

