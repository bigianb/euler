def readFile(filepath):
    with open(filepath, "r") as f:
        return [int(line) for line in f.readlines()]

def solve(depths):
    ups = [x for x in zip(depths, depths[1:]) if x[1] > x[0]]
    return len(ups)

def solve2(depths):
    groups = [x[0]+x[1]+x[2] for x in zip(depths, depths[1:], depths[2:])]
    return solve(groups)

depths = readFile('./inputs/day1_example.txt')
print("day 1 part 1 example = " + str(solve(depths)))
print("day 1 part 2 example = " + str(solve2(depths)))

depths = readFile('./inputs/day1.txt')
print("day 1 part 1 = " + str(solve(depths)))
print("day 1 part 2 = " + str(solve2(depths)))
