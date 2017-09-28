
var decimal = [1]
var power = 1000

for (var p=1; p<=power; ++p){
    let carry = 0
    for (idx=0; idx<decimal.length; ++idx){
        let newval = decimal[idx] * 2 + carry
        if (newval >= 10){
            newval -= 10
            carry = 1
        } else {
            carry = 0
        }
        decimal[idx] = newval
    }
    if (carry > 0){
        decimal.push(carry)
    }
}

let sum = 0
for (idx=0; idx<decimal.length; ++idx){
    sum += decimal[idx]
}

console.log(sum)
