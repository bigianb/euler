
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

function explode(num, depth, state)
{
    if (state.exploded && num.isVal && state.explodedRight >= 0){
        num.val += state.explodedRight;
        state.explodedRight = -1;
        return;
    }

    if (!state.exploded && isSimplePair(num) && depth === 4){
        // explode this
        state.exploded = true;
        num.isVal = true;
        num.val = 0;
        state.explodedLeft = num.left.val;
        state.explodedRight = num.right.val;
        delete num.left;
        delete num.right;
    } else {
        let myLeftExploded=false;
        let explodedIn = state.exploded;
        if (num.left) {
            explode(num.left, depth+1, state);
            myLeftExploded = state.exploded && !explodedIn;
        } 
        if (num.right) {
            explode(num.right, depth+1, state);
        }

        if (state.exploded && !myLeftExploded && num.left && num.left.isVal && state.explodedLeft >= 0){
            // If left is a simple number then we need to add the exploded left val
            num.left.val += state.explodedLeft;
            state.explodedLeft = -1;
        }
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

let num = parse('[[[[[9,8],1],2],3],4]');
console.log(stringify(num));
explode(num, 0, {exploded:false});
console.log(stringify(num));