const fs = require('fs');

function readFromFile(filename) {
    return fileData = fs.readFileSync(filename, 'utf8').trim();
}

class Bitstream
{
    constructor(hexstream)
    {
        this.stream = hexstream.split('').map(c => parseInt(c, 16));
        this.pos = 0;
    }

    isComplete()
    {
        return this.pos + 6 >= this.stream.length * 4;
    }

    take1()
    {
        let idx = this.pos >> 2;
        let byteOffset = 3 - (this.pos & 3);
        ++this.pos;
        return (this.stream[idx] >> byteOffset) & 1;
    }

    take(n)
    {
        let rval = 0;
        while (n > 0){
            rval <<= 1;
            rval |= this.take1();
            --n;
        }
        return rval;
    }

}

function readLiteral(bitstream)
{
    let literal = 0;
    let hasMore = true;
    while (hasMore)
    {
        hasMore = bitstream.take1() == 1;
        let v= bitstream.take(4);
        literal = ((literal << 4) | v);
    }
    return literal;
}

function readPacket(bitstream)
{
    let packet = {children: []}
    packet.version = bitstream.take(3);
    packet.typeId = bitstream.take(3);

    if (packet.typeId === 4){
        packet.literal = readLiteral(bitstream);
    } else {
        const lengthTypeId = bitstream.take1();
        if (lengthTypeId === 0){
            let subPacketLen = bitstream.take(15);
            let endPos = bitstream.pos + subPacketLen;
            while (bitstream.pos < endPos){
                packet.children.push(readPacket(bitstream));
            }
        } else {
            let numSubpackets = bitstream.take(11);
            for (let i=0; i<numSubpackets; ++i){
               packet.children.push(readPacket(bitstream));
            }
        }
    }
    return packet;
}

function readPackets(input)
{
    let bitstream = new Bitstream(input);
    let packets = [];
    while (!bitstream.isComplete())
    {
        packets.push(readPacket(bitstream));
    }
    return packets;
}

function countVersions(packets)
{
    let total=0;
    packets.forEach(packet => {
        total += packet.version;
        total += countVersions(packet.children);
    });
    return total;
}

/*
Packets with type ID 0 are sum packets - their value is the sum of the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
Packets with type ID 1 are product packets - their value is the result of multiplying together the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
Packets with type ID 2 are minimum packets - their value is the minimum of the values of their sub-packets.
Packets with type ID 3 are maximum packets - their value is the maximum of the values of their sub-packets.
Packets with type ID 5 are greater than packets - their value is 1 if the value of the first sub-packet is greater than the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
Packets with type ID 6 are less than packets - their value is 1 if the value of the first sub-packet is less than the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
Packets with type ID 7 are equal to packets - their value is 1 if the value of the first sub-packet is equal to the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
*/
function executePacket(packet)
{
    let output=0;
    let childVals = packet.children.map(c => parseInt(executePacket(c)));
    switch(packet.typeId)
    {
        case 0:
            output = 0;
            childVals.forEach(v => output += v);
            break;
        case 1:
            output = 1;
            childVals.forEach(v => output *= v);
            break;
        case 2:
            output = childVals[0];
            childVals.forEach(v => {if(v < output){output = v}});
            //if (childVals.length > 1){
            //    output = Math.min(...childVals);
            //}
            break;
        case 3:
            output = childVals[0];
            childVals.forEach(v => {if(v > output){output = v}});
            //if (childVals.length > 1){
            //    output = Math.max(...childVals);
           // }
            break;
        case 4:
            output = packet.literal;
            break;
        case 5:
            if (childVals.length != 2){
                console.error('wrong number of children')
            }
            if (childVals[0] > childVals[1]){
                output = 1;
            }
            break;
        case 6:
            if (childVals.length != 2){
                console.error('wrong number of children')
            }
            if (childVals[0] < childVals[1]){
                output = 1;
            }
            break;
        case 7:
            if (childVals.length != 2){
                console.error('wrong number of children')
            }
            if (childVals[0] === childVals[1]){
                output = 1;
            }
            break;
        default:
            console.error('bad ID');
    }
    return output;
}

function stringify(packet)
{
    let val = '';
    let needsParen = packet.children.length > 1;
    let cvals = packet.children.map(c => stringify(c));
    switch(packet.typeId)
    {
        case 0:
            val += cvals.join(' + ');
            break;
        case 1:
            val += cvals.join(' * ');
            break;
        case 2:
            needsParen=false;
            val += 'min(' + cvals.join(', ') + ')';
            break;
        case 3:
            needsParen = false;
            val += 'max(' + cvals.join(', ') + ')';
            break;
        case 4:
            val += packet.literal;
            break;
        case 5:
            val += cvals[0] + ' > ' + cvals[1];
            break;
        case 6:
            val += cvals[0] + ' < ' + cvals[1];
            break;
        case 7:
            val += cvals[0] + ' == ' + cvals[1];
            break;
        default:
            console.error('bad ID');
    }
    if (needsParen){
        val = '(' + val + ')';
    }
    return val;
}

function solve1(input)
{
    let packets = readPackets(input);
    console.log(stringify(packets[0]));
    return countVersions(packets);
}

function solve2(input)
{
    let packets = readPackets(input);
    console.log(stringify(packets[0]));
    return executePacket(packets[0]);
}

console.log("day 16 part 1 example = " + solve1('D2FE28'));
console.log("day 16 part 1 example2 = " + solve1('8A004A801A8002F478'));
console.log("expect 31 = " + solve1('A0016C880162017C3686B18A3D4780'));
console.log("expect 23 = " + solve1('C0015000016115A2E0802F182340'));
console.log("expect 12 = " + solve1('620080001611562C8802118E34'));


console.log("expect 9 = " + solve2('CE00C43D881120'));
console.log("expect 3 = " + solve2('C200B40A82'));
console.log("expect 54 = " + solve2('04005AC33890'));
console.log("expect 7 = " + solve2('880086C3E88112'));
console.log("expect 1 = " + solve2('D8005AC2A8F0'));
console.log("expect 0 = " + solve2('F600BC2D8F'));
console.log("expect 0 = " + solve2('9C005AC2F8F0'));
console.log("expect 1 = " + solve2('9C0141080250320F1802104A08'));

const input = readFromFile('./inputs/day16.txt');
console.log("day 16 part 1 = " + solve1(input));
console.log("day 16 part 2 = " + solve2(input));
// 9752041453 too low