const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    let rules = {};
    let patterns = [];
    let readingRules = true;
    for (let line of lines){
        line = line.trim();
        if (line != ""){
            if (readingRules){
                let rule = parseRule(line);
                rules[rule.id] = rule;
            } else {
                patterns.push(line);
            }
        } else {
            readingRules = false;
        }
    }
    return {rules, patterns};
}

function parseRule(line)
{
    let parts = line.split(': ');
    let rule={id: Number(parts[0])};
    let sec2 = parts[1].trim();
    if (sec2[0] === '"'){
        rule.val = sec2.slice(1, -1);
    } else {
        rule.candidates = [];
        let alternatives = sec2.split('|');
        for (let alternative of alternatives){
            rule.candidates.push(alternative.trim().split(' ').map(x => Number(x)));
        }
    }

    return rule;
}

function ruleMatches(ruleId, rules, pattern)
{
    let rule = rules[ruleId];
    
    const toMatch=pattern.length;
    if (ruleId === 8 && rule.adjusted){
        // 8: 42 | 42 8
        rule = {id: 8, candidates: []}
        for (let i=0; i<toMatch; ++i){
            let s = [];
            for (let j=0; j<=i; ++j){
                s.push(42);
            }
            rule.candidates.push(s);
        }
    } else if (ruleId === 11 && rule.adjusted){
        // 11: 42 31 | 42 11 31
        rule = {id: 11, candidates: []}
        for (let i=0; i<toMatch; ++i){
            let s = [];
            for (let j=0; j<=i; ++j){
                s.push(42);
            }
            for (let j=0; j<=i; ++j){
                s.push(31);
            }
            rule.candidates.push(s);
        }
    }

    let matched = true;
    let remain = pattern;

    if (rule.val){
        if (pattern[0] === rule.val){
            if (pattern.length >= 1){
                remain = pattern.slice(1);
            }
        } else {
            matched = false;
        }
    } else {
        for (let candidate of rule.candidates){
            matched = true;
            remain = pattern;
            for (let subRuleId of candidate){
                let subMatch = ruleMatches(subRuleId, rules, remain);
                matched = matched && subMatch.matched;
                remain = subMatch.remain;
                if (!matched){
                    break;
                }
            }
            if (matched){
                break;
            }
        }
    }

    return {matched, remain}
}


/*
8: 42 | 42 8
11: 42 31 | 42 11 31
*/
function adjustRulesForPt2(input)
{
    input.rules[8] = {id: 8, adjusted: true, candidates: [[42], [42, 8]]};
    input.rules[11] = {id: 11, dajusted: true, candidates: [[42, 31], [42, 11, 31]]};
}

let input = readFromFile('../inputs/day19_examplePt2.txt');

adjustRulesForPt2(input);

// Part 2 is still a WIP. Solved partially by hand and regex.

// babbbbaabbbbbabbbbbbaabaaabaaa
let x = ruleMatches(0, input.rules, 'babbbbaabbbbbabbbbbbaabaaabaaa');


let count=0;
for (let pattern of input.patterns){
    let matchResult = ruleMatches(0, input.rules, pattern);
    if (matchResult.matched && matchResult.remain === ''){
        console.log(pattern + ' matches');
        ++count;
    }
}
console.log('total: ' + count);
