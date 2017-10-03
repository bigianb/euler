let letterCounts = new Map(
    [
        [0,  0],
        [1,  3],
        [2,  3],
        [3,  5],
        [4,  4],
        [5,  4],
        [6,  3],
        [7,  5],
        [8,  5],
        [9,  4],
        [10, 3],
        [11, 6],
        [12, 6],
        [13, 8],
        [14, 8],
        [15, 7],
        [16, 7],
        [17, 9],
        [18, 8],
        [19, 8],
        [20, 6],
        [30, 6],
        [40, 5],
        [50, 5],
        [60, 5],
        [70, 7],
        [80, 6],
        [90, 6],
        [100, 7],
        [1000, 8]
    ]
)

function numberCount(aNum)
{
    if (aNum < 21){
        return letterCounts.get(aNum) 
    }
    if (aNum < 100){
        let units = aNum % 10
        let tens = aNum - units
        return letterCounts.get(tens) + letterCounts.get(units)
    }
    if (aNum < 1000){
        let remain = aNum % 100
        let hundreds = (aNum - remain) / 100
        let sum = letterCounts.get(hundreds) + letterCounts.get(100)
        if (remain > 0){
            sum += 3 + numberCount(remain)
        }
        return sum
    }
    return letterCounts.get(1) + letterCounts.get(1000)
}

console.log(numberCount(342))

let sum=0
for (let num=1; num <= 1000; ++num){
    sum += numberCount(num)
}
console.log(sum)
