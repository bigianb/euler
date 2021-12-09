
def readFile(filepath):
    with open(filepath, "r") as f:
        pairs = [l.split(' | ') for l in f.readlines()]

        lines = []
        for pair in pairs:
            inputs = [''.join(sorted(n.strip())) for n in pair[0].split(' ')]
            outputs = [''.join(sorted(n.strip())) for n in pair[1].split(' ')]
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


def solveLine(line):
    knownInputDigits = {}

    unknown = set(line['inputs'])

    for input in line['inputs']:
        inputlen = len(input)
        if (inputlen == 2):
            # 1 = 'cf'
            knownInputDigits['1'] = input
            unknown.remove(input)
        if (inputlen == 3):
            # 7 = 'acf'
            knownInputDigits['7'] = input
            unknown.remove(input)
        if (inputlen == 4):
            # 4 = 'bcdf'
            knownInputDigits['4'] = input
            unknown.remove(input)
        if (inputlen == 7):
            # 8 = 'abcdefg
            knownInputDigits['8'] = input
            unknown.remove(input)
    # Unique digits done

    # wire a is 7 - 1
    wireA = set(knownInputDigits['7']).difference(set(knownInputDigits['1']))
    # wires bd = 4 - 1
    wiresBD = set(knownInputDigits['4']).difference(set(knownInputDigits['1']))

    # 5 segment with abd is '5'
    abd = wireA.union(wiresBD)
    for input in line['inputs']:
        inputlen = len(input)
        if abd <= set(input):
            if inputlen == 5:
                knownInputDigits['5'] = input
                unknown.remove(input)

    if '5' not in knownInputDigits:
        print(abd)
        print(knownInputDigits)
        print(unknown)

    # 6 segment with abde is '6'
    wiresCE = set(knownInputDigits['8']).difference(set(knownInputDigits['5']))
    wireE = wiresCE.difference(set(knownInputDigits['1']))

    abde = wireA.union(wiresBD, wireE)
    for input in line['inputs']:
        inputlen = len(input)
        if abde <= set(input):
            if inputlen == 6:
                knownInputDigits['6'] = input
                unknown.remove(input)

#          0        1      2       3        4       5         6        7      8          9
#wires = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg']
#          .....     ..                      ....    xxxx      xxxx      ...    .......    xxxxxx
# A  = 7 - 1
# BD = 4 - 1
# CE = 8 - 5
# E = 8 - 5 - 1 = 6 - 5
# C = 8 - 6
# F = 1 - C
# G = 5 - A - BD - F

# 9 = 8 - e

    knownInputDigits['9'] = ''.join(sorted(set(knownInputDigits['8']).difference(wireE)))
    unknown.remove(knownInputDigits['9'])

    # The only unknown of 6 segments is now 0
    for u in unknown:
        if len(u) == 6:
            knownInputDigits['0'] = u
    unknown.remove(knownInputDigits['0'])

    eVal = wireE.pop()
    for u in unknown:
        if eVal in u:
            knownInputDigits['2'] = u
        else:
            knownInputDigits['3'] = u

    knownPatterns = {}
    for k in knownInputDigits:
        knownPatterns[knownInputDigits[k]] = int(k)

    val = 0
    for output in line['outputs']:
        v1 = knownPatterns[output]
        val = val * 10 + v1
    print(val)
    return val

def solve(lines):
    sum = 0
    for line in lines:
        sum += solveLine(line)
    return sum


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
print("day 8 part 2 = " + str(solve(lines)))
