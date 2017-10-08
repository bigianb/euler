const fs = require('fs');
let contents = fs.readFileSync('js/set0xx/p067_triangle.txt');
contents = String(contents)
let lines = contents.split("\n")

let data = []

lines.forEach(function(line) {
  let vals = line.split(' ')
  let dataLine = []
  vals.forEach(function(num){
    dataLine.push(Number(num))
  })
  data.push(dataLine)
});

// start at the bottom and bubble up the largest possible sum.

let rows = data.length

for (let row=rows-1; row >0; --row)
{
    let prevRow = row - 1
    let sourceRow = data[row]
    let numCols = sourceRow.length
    for (let col=0; col < numCols-1; ++col)
    {
        let c1 = sourceRow[col]
        let c2 = sourceRow[col+1]
        let maxChild = c1 > c2 ? c1 : c2
        data[prevRow][col] += maxChild
    }
}
console.log(data[0][0])