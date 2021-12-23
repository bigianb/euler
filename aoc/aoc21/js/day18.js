
function parse(snum)
{
    let num={}
    // never have a number > 9
    let chars = snum.split('');
    // strip of the enclosing parens
    chars = chars.slice(1, chars.length-1);
 vc
    let depth = 0;
    let i=0;
    while (i < chars.length){
        if (chars[i] === '['){
            ++depth;
        }
        if (chars[i] == ']'){
            --depth;
        }
        if (chars[i] === ',' && depth === 0)
        {

        }
    }

    return num;
}

parse('[[[[[9,8],1],2],3],4]')