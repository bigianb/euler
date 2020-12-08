
class Node
{
    constructor(prev, next, val){
        this.prev=prev;
        this.next=next;
        this.val=val;
    }
}

class CircularList
{
    constructor(val){
        this.curNode = new Node(null, null, val);
        this.curNode.prev = this.curNode;
        this.curNode.next = this.curNode;
    }

    stepLeft(num)
    {
        while(num > 0){
            this.curNode = this.curNode.prev;
            --num;
        }
    }

    stepRight(num)
    {
        while(num > 0){
            this.curNode = this.curNode.next;
            --num;
        }
    }

    remove()
    {
        let val = this.curNode.val;
        this.curNode.prev.next = this.curNode.next;
        this.curNode.next.prev = this.curNode.prev;
        this.curNode = this.curNode.next;

        return val;
    }

    add(val)
    {
        // insert after curNode
        let node = new Node(this.curNode, this.curNode.next, val);
        this.curNode.next.prev = node;
        this.curNode.next = node;
        this.curNode = node;
    }
}

 

function play(numPlayers, highestMarble)
{
    let playerScores = []
    for (let p=0; p<numPlayers; ++p){
        playerScores[p] = 0;
    }

    let list = new CircularList(0);
    let curMarble=1;
    let curPlayer=0;

    while (curMarble <= highestMarble){
        if (0 == curMarble % 23){
            playerScores[curPlayer] += curMarble;
            list.stepLeft(7);
            playerScores[curPlayer] += list.remove();
        } else {
            list.stepRight(1);
            list.add(curMarble);
        }
        ++curMarble;
        ++curPlayer;
        curPlayer = curPlayer % numPlayers;
    }
    return Math.max(...playerScores);
}


console.log(play(9, 25));
console.log(play(413, 71082));
