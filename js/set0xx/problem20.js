var bigInt = require("big-integer");

let fac=bigInt(1)
for (let x=2; x <101; ++x)
{
    fac = fac.times(x)
}

let sum=0
do {
  dm= fac.divmod(10)
  sum += dm.remainder
  fac=dm.quotient
} while(fac>0)

console.log(sum)

