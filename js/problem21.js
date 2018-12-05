/*
Let d(n) be defined as the sum of proper divisors of n (numbers less than n which divide evenly into n).
If d(a) = b and d(b) = a, where a ≠ b, then a and b are an amicable pair and each of a and b are called amicable numbers.

For example, the proper divisors of 220 are 1, 2, 4, 5, 10, 11, 20, 22, 44, 55 and 110; therefore d(220) = 284.
The proper divisors of 284 are 1, 2, 4, 71 and 142; so d(284) = 220.

Evaluate the sum of all the amicable numbers under 10000.
*/

function findDivisors(n)
{
    let divisors = [];
    // only really need to loop until sqrt(n)
    for (let i=1; i<n; ++i){
        if (!(n % i)){
            divisors.push(i);
        }
    }
    return divisors;
}

function sum(array)
{
    let result = 0;
    for (let x of array){
        result += x;
    }
    return result;
}

let amicableNumbers = {}

for (let a=220; a < 10000; ++a)
{
    if (!amicableNumbers[a]){
        let divisors = findDivisors(a);
        let b = sum(divisors);
        if (a != b){
            let divisors_b = findDivisors(b);
            let d_b = sum(divisors_b);
            if (d_b == a){
                amicableNumbers[a] = a;
                amicableNumbers[b] = b;
            }
        }
    }
}

console.log(amicableNumbers);
console.log(sum(Object.values(amicableNumbers)));
