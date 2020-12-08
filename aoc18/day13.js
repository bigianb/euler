const theData=require('./day13data');

class Cart
{
    constructor(x,y,dir)
    {
        this.x=x;
        this.y=y;
        this.dir=dir;
    }
}

function findCarts(data)
{
    let carts=[];
    let newData=[]
    for (let y=0; y<data.length; ++y){
        let row = data[y]
        let newRow=[]
        for (let x=0; x<row.length; ++x){
            const c = row[x];
            switch(c)
            {
                case '>':
                    carts.push(new Cart(x,y,'>'));
                    newRow[x] = '-';
                break;
                case '^':
                    carts.push(new Cart(x,y,'^'));
                    newRow[x] = '|';
                break;
                case 'V':
                case 'v':
                    carts.push(new Cart(x,y,'v'));
                    newRow[x] = '|';
                break;
                case '<':
                    carts.push(new Cart(x,y,'<'));
                    newRow[x] = '-';
                break;
                default:
                    newRow[x] = c;
                    break;
            }
        }
        newData[y]=newRow;
    }
    return {carts: carts, data:newData};
}

let state = findCarts(theData.data);
console.log(state.carts);

state = findCarts(state.data);
console.log(state.carts);
