def readFile(filepath):
    with open(filepath, "r") as f:
        return [int(line, 2) for line in f.readlines()]

def countBitOccurances(numbers, bitpos):
    count=0
    mask = 1 << bitpos
    for number in numbers:
        if number & mask == 0:
            count -= 1
        else:
            count += 1
    return count

def solve(numbers, numBits):
    gamma = 0
    for bitpos in range(numBits-1, -1, -1):
        count = countBitOccurances(numbers, bitpos)
        if count >= 0:
            gamma |= (1 << bitpos)
    mask = (1 << numBits) - 1
    return gamma * ((~gamma) & mask)

def findRating(numbers, numBits, bitTest):
    candidates = numbers.copy()
    bitpos = numBits-1
    while len(candidates) > 1 and bitpos >= 0:
        count = countBitOccurances(candidates, bitpos)
        mostCommon = bitTest(count)
        candidates = [n for n in candidates if ((n >> bitpos) & 1) == mostCommon]
        bitpos -= 1
    return candidates[0]

def solve2(numbers, numBits):
    oxRating = findRating(numbers, numBits, lambda count: 1 if count >= 0 else 0)
    c02Rating = findRating(numbers, numBits, lambda count: 1 if count < 0 else 0)

    return oxRating * c02Rating

numbers = readFile('./inputs/day3_example.txt')
print("day 1 part 1 example = " + str(solve(numbers, 5)))
print("day 1 part 2 example = " + str(solve2(numbers, 5)))

numbers = readFile('./inputs/day3.txt')
print("day 1 part 1 = " + str(solve(numbers, 12)))
print("day 1 part 2 = " + str(solve2(numbers, 12)))
