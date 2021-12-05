
def readFile(filepath):
    with open(filepath, "r") as f:
        pairs = [l.split(' -> ') for l in f.readlines()]

        lines = []
        for pair in pairs:
            c0 = [int(n) for n in pair[0].split(',')]
            c1 = [int(n) for n in pair[1].split(',')]
            lines.append([c0, c1])
        return lines

def solve(lines, includeDiag=False):
    map = {}
    for line in lines:
        x0 = line[0][0]
        x1 = line[1][0]
        y0 = line[0][1]
        y1 = line[1][1]
        xstep = 0
        ystep = 0

        steps=0
        if x0 == x1:
            # vertical
            steps = abs(y1 - y0) + 1
            ystep = ystep = 1 if y1 > y0 else -1
        if y0 == y1:
            # horizontal
            steps = abs(x1 - x0) + 1
            xstep = 1 if x1 > x0 else -1
        if includeDiag and abs(x1 - x0) == abs(y1 - y0):
            # diagonal 46 deg
            steps = abs(y0 - y1) + 1
            xstep = 1 if x1 > x0 else -1
            ystep = 1 if y1 > y0 else -1
 
        x = x0
        y = y0
        while steps > 0:
            key = f'{x},{y}'
            if key in map:
                map[key] += 1
            else:
                map[key] = 1
            x += xstep
            y += ystep
            steps -= 1
    crosses = [k for k,v in map.items() if v > 1]
    return len(crosses)

lines = readFile('./inputs/day5_example.txt')
print("day 1 part 1 example = " + str(solve(lines)))
print("day 1 part 2 example = " + str(solve(lines, True)))

lines = readFile('./inputs/day5.txt')
print("day 1 part 1 = " + str(solve(lines)))
print("day 1 part 2 = " + str(solve(lines, True)))
