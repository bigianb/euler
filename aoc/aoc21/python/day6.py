
def readFile(filepath):
    with open(filepath, "r") as f:
        return [int(n) for n in f.readline().split(',')]

def buildPop(fish):
    pop = {'0': 0, '1':0, '2':0, '3':0, '4':0, '5':0, '6':0, '7':0, '8': 0}
    for f in fish:
        pop[str(f)] += 1
    return pop

def solve(pop, gens):
    for gen in range(gens):
        oldZero = pop['0']
        for day in range(8):
            pop[str(day)] = pop[str(day+1)]
        pop['6'] += oldZero
        pop['8'] = oldZero

    sum = 0
    for day in range(9):
        sum += pop[str(day)]
    return sum

fish = readFile('./inputs/day6_example.txt')
print("day 1 part 1 example = " + str(solve(buildPop(fish), 80)))
print("day 1 part 2 example = " + str(solve(buildPop(fish), 256)))

fish = readFile('./inputs/day6.txt')
print("day 1 part 1 = " + str(solve(buildPop(fish), 80)))
print("day 1 part 1 = " + str(solve(buildPop(fish), 256)))
