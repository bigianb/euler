const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    let output = []
    let obj = {}
    for (let line of lines){
        line = line.trim();
        if (line === ""){
            output.push(obj);
            obj = {}
        } else {
            addEntries(obj, line);
        }
    }
    if (obj !== {}){
        output.push(obj);
    }
    return output;
}

function addEntries(obj, line)
{
    let parts = line.split(/\s+/);
    for (let part of parts){
        let kv = part.split(':');
        obj[kv[0]] = kv[1];
    }
}

function validateCid(data)
{
    let valid = [];
    let invalid = [];
    for (let entry of data){
        let keys = Object.keys(entry);
        if (keys.length === 8){
            valid.push(entry);
        } else if (keys.length === 7 && !('cid' in entry)){
            valid.push(entry);
        } else {
            invalid.push(entry);
        }
    }
    return {valid, invalid}
}

function validateValues(data){
    let valid = [];
    for (let entry of data){
        let isValid = true;
        let byr = Number(entry.byr);
        if (byr < 1920 || byr > 2002){
            isValid = false;
        }
        let iyr = Number(entry.iyr);
        if (iyr < 2010 || iyr > 2020){
            isValid = false;
        }
        let eyr = Number(entry.eyr);
        if (eyr < 2020 || eyr > 2030){
            isValid = false;
        }
        let hgt = entry.hgt;
        let hgtUnits = hgt.slice(-2);
        let hgtNum = Number(hgt.slice(0, -2));
        if (hgtUnits === 'cm'){
            if (hgtNum < 150 || hgtNum > 193){
                isValid = false;
            }
        } else if (hgtUnits === 'in'){
            if (hgtNum < 59 || hgtNum > 76){
                isValid = false;
            }
        } else {
            isValid = false;
        }
        let hcl = entry.hcl;
        let matches = hcl.match(/^#[0-9a-f]{6}$/);
        if (!matches){
            isValid = false;
        }
        let ecl = entry.ecl;
        let eclOk = (ecl === 'amb' || ecl === 'blu' || ecl === 'brn' || ecl === 'gry' || ecl === 'grn' || ecl === 'hzl' || ecl === 'oth');
        if (!eclOk){
            isValid = false;
        }
        let pidMatches = entry.pid.match(/^[0-9]{9}$/);
        if (!pidMatches){
            isValid = false;
        }
        if (isValid){
            valid.push(entry);
        }
    }
    return {valid}
}

const exampleData = readFromFile('../inputs/day4_example.txt');
let validation = validateCid(exampleData);
console.log(validation.valid.length);

const data = readFromFile('../inputs/day4.txt');
validation = validateCid(data);
validation = validateValues(validation.valid);
console.log(validation.valid.length);
