
def readFile(filepath):
    with open(filepath, "r") as f:
        pairs = [l.split(' | ') for l in f.readlines()]

        lines = []
        for pair in pairs:
            inputs = [n.strip() for n in pair[0].split(' ')]
            outputs = [n.strip() for n in pair[1].split(' ')]
            lines.append({'inputs': inputs, 'outputs': outputs})
        return lines



#  0:      1:      2:      3:      4:
#  aaaa    ....    aaaa    aaaa    ....
# b    c  .    c  .    c  .    c  b    c
# b    c  .    c  .    c  .    c  b    c
#  ....    ....    dddd    dddd    dddd
# e    f  .    f  e    .  .    f  .    f
# e    f  .    f  e    .  .    f  .    f
#  gggg    ....    gggg    gggg    ....
#
#   5:      6:      7:      8:      9:
#  aaaa    aaaa    aaaa    aaaa    aaaa
# b    .  b    .  .    c  b    c  b    c
# b    .  b    .  .    c  b    c  b    c
#  dddd    dddd    ....    dddd    dddd
# .    f  e    f  .    f  e    f  .    f
# .    f  e    f  .    f  e    f  .    f
#  gggg    gggg    ....    gggg    gggg

segmentVals = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6]
wires = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg']
#                   ..                      ....                       ...    .......

def restrict(current, restriction):
    output = ''
    for c in restriction:
        if c in current:
            output += c
    return output

def solved(possibilities):
    solved = True
    for p in possibilities:
        if len(possibilities[p]) != 1:
            solved = False
    return solved

def removeChar(alist, c):
    output = ''
    for cx in alist:
        if cx != c:
            output += cx
    return output

def removeChars(alist, str):
    output = alist
    for c in str:
        output = removeChar(output, c)
    return output

def isViable(possibility, numbers):
    for n in numbers:
        translated = []
        for c in n:
            translated.append(possibility[c][0])
        translated.sort()
        translated = ''.join(translated)
        if translated not in wires:
            return False
    return True


def solveLine(line):
    possibilities = {'a': 'abcdefg', 'b':'abcdefg', 'c': 'abcdefg', 'd':'abcdefg', 'e':'abcdefg', 'f':'abcdefg', 'g':'abcdefg'}
    knownInputDigits = {}

    for input in line['inputs'] + line['outputs']:
        inputlen = len(input)
        if (inputlen == 2):
            # 1 = 'cf'
            knownInputDigits['1'] = input
            possibilities['a'] = removeChars(possibilities['a'], input)
            possibilities['b'] = removeChars(possibilities['b'], input)
            possibilities['c'] = restrict(possibilities['c'], input)
            possibilities['d'] = removeChars(possibilities['d'], input)
            possibilities['e'] = removeChars(possibilities['e'], input)
            possibilities['f'] = restrict(possibilities['f'], input)
            possibilities['g'] = removeChars(possibilities['g'], input)
        if (inputlen == 3):
            # 7 = 'acf'
            knownInputDigits['7'] = input
            possibilities['a'] = restrict(possibilities['a'], input)
            possibilities['b'] = removeChars(possibilities['b'], input)
            possibilities['c'] = restrict(possibilities['c'], input)
            possibilities['d'] = removeChars(possibilities['d'], input)
            possibilities['e'] = removeChars(possibilities['e'], input)
            possibilities['f'] = restrict(possibilities['f'], input)
            possibilities['g'] = removeChars(possibilities['g'], input)
        if (inputlen == 4):
            # 4 = 'bcdf'
            knownInputDigits['4'] = input
            possibilities['a'] = removeChars(possibilities['a'], input)
            possibilities['b'] = restrict(possibilities['b'], input)
            possibilities['c'] = restrict(possibilities['c'], input)
            possibilities['d'] = restrict(possibilities['d'], input)
            possibilities['e'] = removeChars(possibilities['e'], input)
            possibilities['f'] = restrict(possibilities['f'], input)
            possibilities['g'] = removeChars(possibilities['g'], input)
    # Unique digits done
    changed = True
    while changed:
        changed = False
        for c in 'abcdefg':
            if len(possibilities[c]) == 1:
                knownVal = possibilities[c][0]
                for c2 in 'abcdefg':
                    if c != c2:
                        if knownVal in possibilities[c2]:
                            possibilities[c2] = removeChar(possibilities[c2], knownVal)
                            changed = True

    # Now we've narrowed down the options, we need to do a search
    print(possibilities)
    isViable(possibilities, line['inputs'] + line['outputs'])







def solve(lines):
    for line in lines:
        vals = solveLine(line)


def countUnique(lines):
    count = 0
    for line in lines:
        for output in line['outputs']:
            outlen = len(output)
            if (outlen == 2 or outlen == 4 or outlen == 3 or outlen == 7):
                count += 1
    return count

lines = readFile('./inputs/day8_example1.txt')
print("day 8 part 1 example1 = " + str(countUnique(lines)))
print("day 8 part 2 example1 = " + str(solve(lines)))

lines = readFile('./inputs/day8_example.txt')
print("day 8 part 1 example = " + str(countUnique(lines)))
print("day 8 part 2 example = " + str(solve(lines)))

lines = readFile('./inputs/day8.txt')
print("day 8 part 1 = " + str(countUnique(lines)))
#print("day 1 part 1 = " + str(solve(lines)))
#print("day 1 part 2 = " + str(solve(lines, True)))
