def readFile(filepath):
    with open(filepath, "r") as f:
        return [line.split() for line in f.readlines()]

def solve(commands):
    xpos = 0
    ypos = 0
    for entry in commands:
        if entry[0] == 'forward':
            xpos += int(entry[1])
            pass
        elif entry[0] == 'up':
            ypos -= int(entry[1])
            pass
        elif entry[0] == 'down':
            ypos += int(entry[1])
            pass
        else:
            print('unknown command' + entry[0])
            raise

    return xpos * ypos

def solve2(commands):
    xpos = 0
    ypos = 0
    aim = 0
    for entry in commands:
        if entry[0] == 'forward':
            xpos += int(entry[1])
            ypos += aim * int(entry[1])
            pass
        elif entry[0] == 'up':
            aim -= int(entry[1])
            pass
        elif entry[0] == 'down':
            aim += int(entry[1])
            pass
        else:
            print('unknown command' + entry[0])
            raise

    return xpos * ypos

commands = readFile('./inputs/day2_example.txt')
print("day 2 part 1 example = " + str(solve(commands)))
print("day 2 part 2 example = " + str(solve2(commands)))

commands = readFile('./inputs/day2.txt')
print("day 2 part 1 = " + str(solve(commands)))
print("day 2 part 2 = " + str(solve2(commands)))
