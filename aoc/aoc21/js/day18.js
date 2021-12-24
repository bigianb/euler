const fs = require('fs');

function readLines(filename) {
    const fileData = fs.readFileSync(filename, 'utf8');
    return fileData.split(/\n/).map(line => line.trim());
}

function parse(snum)
{
    let num={}
    // never have a number > 9
    let chars = snum.split('');
    if (chars.length === 1){
        return {val: Number(chars[0]), isVal:true}
    }
    // strip of the enclosing parens
    chars = chars.slice(1, -1);
 
    let depth = 0;
    let i=0;
    let start=0;
    while (i < chars.length){
        if (chars[i] === '['){
            ++depth;
        }
        if (chars[i] == ']'){
            --depth;
        }
        if (chars[i] === ',' && depth === 0)
        {
            num.left = parse(chars.slice(0, i).join(''));
            start = i+1;
            break;
        }
        ++i;
    }
    num.right = parse(chars.slice(start).join(''));
    return num;
}

function isSimplePair(num)
{
    return (!num.isVal && num.left.isVal && num.right.isVal);
}

function explode(num, stack, depth, state)
{
    if (state.exploded && state.explodedRight === -1)
    {
        return state;
    }

    if (state.exploded && num.isVal && state.explodedRight >= 0){
        num.val += state.explodedRight;
        state.explodedRight = -1;
        return state;
    }
    
    if (num.isVal){
        stack.push(num);
    }

    if (!state.exploded && isSimplePair(num) && depth === 4){
        // explode this
        state.exploded = true;
        num.isVal = true;
        num.val = 0;
        let leftVal = num.left.val;
        state.explodedRight = num.right.val;
        delete num.left;
        delete num.right;

        while (stack.length > 0){
            let stackNum = stack.pop();
            if (stackNum.isVal){
                stackNum.val += leftVal;
                break;
            }
        }
    } else {
        if (num.left) {
            explode(num.left, stack, depth+1, state);
        } 
        if (num.right) {
            explode(num.right, stack, depth+1, state);
        }
    }
    return state;
}

function split(num)
{
    let done = false;
    if (num.isVal){
        if (num.val > 9){
            let lval = Math.floor(num.val / 2);
            let rval = Math.ceil(num.val / 2);
            num.isVal=false;
            delete num.val;
            num.left = {isVal: true, val: lval}
            num.right = {isVal: true, val: rval}

            done = true;
        }
    } else {
        done = split(num.left);
        if (!done){
            done = split(num.right);
        }
    }
    return done;
}

function add(num1, num2)
{
    let newNum = {left: num1, right: num2}
    reduce(newNum);
    return newNum;
}

function reduce(num)
{
    let allDone = false;
    while (!allDone){
        while(true){
            let {exploded} = explode(num, [], 0, {exploded:false});
            if (!exploded){
                break;
            }
        }
        let splitDone = split(num);
        allDone = !splitDone;
    }
}

function stringify(num, sofar='')
{
    if (num.isVal){
        sofar += num.val;
    } else {
        sofar += '[';

        sofar = stringify(num.left, sofar);

        sofar += ',';
        sofar = stringify(num.right, sofar);

        sofar += ']';

    }
    return sofar;
}

function calcMag(num)
{
    if (num.isVal){return num.val};
    return 3 * calcMag(num.left) + 2 * calcMag(num.right);
}

function addLines(lines)
{
    let num = add(parse(lines[0]), parse(lines[1]));
    for (let i=2; i<lines.length; ++i){
        num = add(num, parse(lines[i]));
    }
    return num;
}

let num = parse('[[[[[9,8],1],2],3],4]');
console.log(stringify(num));
//explode(num, 0, {exploded:false});
//console.log(stringify(num));

//explode(parse('[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]'), [], 0, {exploded: false});

num = add(parse('[[[[4,3],4],4],[7,[[8,4],9]]]'), parse('[1,1]'));
console.log(stringify(num));

let lines = readLines('./inputs/day18_example.txt');
num = addLines(lines);
console.log(calcMag(num));

lines = readLines('./inputs/day18.txt');
num = addLines(lines);
console.log(calcMag(num));