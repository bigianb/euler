const basePattern = [0, 1, 0, -1]

function getMultiplerArray(element, length)
{
    let array = [];
    array.length = length;
    let repeat = basePattern.length * element;
    for (let i=0; i<length; ++i){
        let ii = i+1;
        let j = ii % repeat;
        let k = Math.floor(j/element);
        array.push(basePattern[k]);
    } 
    return array;
}

function runFFT(val, startOffset)
{
    const len = val.length;
    //console.log('len ' + len);
    let oVal = '';
    let nVal = [];
    for (let c of val){
        nVal.push(Number(c));
    }
    if (startOffset > len){
        let tot = 0;
        for (let i=len-1; i >= 0; --i){
            tot += nVal[i];
            oVal = ''+tot % 10 + oVal;
        }
    } else {
        for (let i=0; i<len; ++i){
            let virtualIdx = i+startOffset+1
            let repeat = basePattern.length * virtualIdx;
            let tot=0;
            for (let j=i; j<len; ++j){
                let j1 = (j+startOffset+1) % repeat;
                let j2 = Math.floor(j1/virtualIdx);
                tot += nVal[j] * basePattern[j2];
            }
            oVal += Math.abs(tot) % 10;
        }
    }
    return oVal;
}

function runFFTs(inval, steps, startOffset)
{
    let val = inval;
    for (let step=0; step<steps; ++step){
        console.log(step);
        val = runFFT(val, startOffset)
    }
    return val;
}

console.log(runFFTs("80871224585914546619083218645595", 100, 0));

let input = "59705379150220188753316412925237003623341873502562165618681895846838956306026981091618902964505317589975353803891340688726319912072762197208600522256226277045196745275925595285843490582257194963750523789260297737947126704668555847149125256177428007606338263660765335434914961324526565730304103857985860308906002394989471031058266433317378346888662323198499387391755140009824186662950694879934582661048464385141787363949242889652092761090657224259182589469166807788651557747631571357207637087168904251987880776566360681108470585488499889044851694035762709053586877815115448849654685763054406911855606283246118699187059424077564037176787976681309870931";
//let output = runFFTs(input, 100);
//console.log(output.substring(0,8));

// test
//input = "03036732577212944063491565474664";

let x = "";
for (let i=0; i<10000; ++i){
    x += input;
}
let messageOffset = Number(input.substring(0, 7));
x = x.substring(messageOffset);
let output = runFFTs(x, 100, messageOffset);

console.log(output.substring(0,8));
