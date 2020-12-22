
function exec(expr)
{
    let tokens = tokenise(expr);
    return execTokens(tokens.values()).lhs;
}

function execTokens(tokenValues)
{
    let lhs = collectConst(tokenValues);
    let opObj = tokenValues.next();
    while(!opObj.done && opObj.value !== ')') {
        let op = opObj.value;
        let rhs = collectConst(tokenValues);
        switch(op)
        {
            case '+':
                lhs = lhs+rhs;
                break;
            case '*':
                lhs = lhs*rhs;
                break;
            default:
                console.log('unknown operator ' + op);
                break;
        }
        opObj = tokenValues.next();
    }
    return {lhs, opObj};
}

function execPt2(expr)
{
    let tokens = tokenise(expr).values();
    let ast = buildAst(tokens);
    while (ast.length > 1){
        ast = reduceAst(ast);
    }
    return ast[0].val;
}

function reduceAst(ast, priority)
{
    let done=false;
    while (!done){
        let result = execAst(ast, priority);
        done = !result.changed;
        ast = result.newAst;
    }
    return ast;
}

function buildAst(tokens)
{
    let ast = [];
    let token = tokens.next();
    while (!token.done && token.value !== ')'){
        if (token.value === '('){
            ast.push({isSubexpr: true, subtree: buildAst(tokens)});
        } else if (token.value === '+'){
            ast.push({isOperator: true, name: '+', priority: 1, func: (lhs, rhs) => Number(lhs)+Number(rhs)})
        } else if (token.value === '*'){
            ast.push({isOperator: true, name: '*', priority: 2, func: (lhs, rhs) => Number(lhs)*Number(rhs)})
        } else {
            ast.push({isNum: true, val: Number(token.value)});
        }
        token = tokens.next();
    }
    return ast;
}

function execAst(ast)
{
    let newAst = [];
    let changed = false;
    // check if any sub expressions from this level.
    let hasSubexpr = false;
    let highestPriority = 100;
    for (let node of ast){
        if (node.isSubexpr){
            hasSubexpr = true;
        }
        if (node.isOperator && node.priority < highestPriority){
            highestPriority = node.priority;
        }
    }


    for (let i=0; i<ast.length; ++i)
    {
        let newnode = null;
        let node = ast[i];
        if (node.isSubexpr){
            let newSubastResult = execAst(node.subtree);
            if (!newSubastResult.changed){
                newnode = node;
            } else {
                changed = true;
                newSubast = newSubastResult.newAst;
                if (newSubast.length === 1){
                    newnode = newSubast[0];
                } else {
                    newnode = {isSubexpr: true, subtree: newSubast}
                }
            }
        } else if (node.isOperator && !hasSubexpr){
            const lhs = newAst.pop();
            const rhs = ast[i+1];
            if (lhs.isNum && rhs.isNum && node.priority === highestPriority){
                let opResult = node.func(lhs.val, rhs.val);
                newnode = {isNum: true, val: opResult};
                ++i;    // skip over RHS
                changed = true;
            } else {
                newAst.push(lhs);   // put it back
                newnode = node;
            }
        } else {
            newnode = node;
        }
        if (newnode){
            newAst.push(newnode);
        }
    }
    return {newAst, changed};
}

function collectConst(tokenValues)
{
    let val = tokenValues.next().value;
    if (val === '('){
        let {lhs,opObj} = execTokens(tokenValues);
        val = lhs;
        if (opObj.value !== ')'){
            console.error('expected close paren but got ' + opObj.value);
        }
    }
    return Number(val);
}

function tokenise(expr)
{
    let tokens = expr.split(/(\s+|[\(\)])/);
    return tokens.filter(x => x.trim().length > 0);
}

console.log('test, should be 13632 = '+exec('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'));

const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\n/);
    let output = []
    for (let line of lines){
        if (line != ""){
            output.push(line);
        }
    }
    return output;
}

let expressions = readFromFile('../inputs/day18.txt');
let total=0;
for (let expression of expressions){
    total += exec(expression)
}
console.log('part 1 = '+total)

console.log('1445 should be ' + execPt2('5 + (8 * 3 + 9 + 3 * 4 * 3)'));    

console.log(execPt2('((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'));

total=0;
for (let expression of expressions){
    total += execPt2(expression)
}
console.log('part 2 = '+total)

// val op val op val
