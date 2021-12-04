def readBlock(lines):
    block = []
    for lineNo in range(5):
        block.append([int(n) for n in lines[lineNo].split()])
    return block

def readFile(filepath):
    with open(filepath, "r") as f:
        lines = f.readlines()
        numbers = [int(n) for n in lines[0].split(',')]

        numBlocks = (len(lines) - 1)//6
        blocks = []
        for blockNo in range(numBlocks):
            blocks.append(readBlock(lines[blockNo*6+2:]))
        return numbers, blocks

def checkSolved(block):
    for row in block:
        if row[0] == row[1] == row[2] == row[3] == row[4] == -1:
            return True
    for colNo in range(5):
        if block[0][colNo] == block[1][colNo] == block[2][colNo] == block[3][colNo] == block[4][colNo] == -1:
            return True
    return False

def calcSum(block):
    sum=0
    for row in block:
        for cell in row:
            if cell > 0: sum += cell
    return sum

def markSolved(block):
    for row in range(5):
        block[row] = [-2,-2,-2,-2,-2]

def solve(numbers, blocks):
    winners = []
    for number in numbers:
        for block in blocks:
            for row in block:
                for c in range(len(row)):
                    if row[c] == number: row[c] = -1
            if checkSolved(block):
                winners.append(number * calcSum(block))
                markSolved(block)
    return winners

numbers, blocks = readFile('./inputs/day4_example.txt')
solution = solve(numbers, blocks)
print("day 1 part 1 example = " + str(solution[0]))
print("day 1 part 2 example = " + str(solution[len(solution)-1]))

numbers, blocks = readFile('./inputs/day4.txt')
solution = solve(numbers, blocks)
print("day 1 part 1 = " + str(solution[0]))
print("day 1 part 2 = " + str(solution[len(solution)-1]))
