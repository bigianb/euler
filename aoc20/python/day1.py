def readFile(filepath):
    with open(filepath, "r") as f:
        return [int(line) for line in f.readlines()]

def solve(numbers):
    for i in range(len(numbers)):
        for j in range(i+1, len(numbers)):
            if numbers[i] + numbers[j] == 2020:
                return numbers[i] * numbers[j]
    raise Exception()

def solveTriple(numbers):
    for i in range(len(numbers)):
        for j in range(i+1, len(numbers)):
            for k in range(j+1, len(numbers)):
                if numbers[i] + numbers[j] + numbers[k] == 2020:
                    return numbers[i] * numbers[j] * numbers[k]
    raise Exception()

example_numbers = readFile('./inputs/day1_example.txt')
print(example_numbers)
print(solve(example_numbers))

numbers = readFile('./inputs/day1.txt')
print("day 1 part 1 = " + str(solve(numbers)))
print("day 1 part 2 = " + str(solveTriple(numbers)))
