def read_lines_from_file(filepath):
    with open(filepath, "r") as f:
        return [line.strip() for line in f.readlines()]


def find_digits1(line):
    digits = []
    for character in line:
        if character.isdigit():
            digits.append(int(character))
    return digits


def find_calibration_value(line, digit_finder):
    digits = digit_finder(line)
    return digits[0] * 10 + digits[len(digits)-1];


example1_lines = read_lines_from_file('./inputs/day1_example1.txt')
calibration_values = [find_calibration_value(line, find_digits1) for line in example1_lines]
print("part 1 example = " + str(sum(calibration_values)))

lines = read_lines_from_file('./inputs/day1.txt')
calibration_values = [find_calibration_value(line, find_digits1) for line in lines]
print("part 1 = " + str(sum(calibration_values)))

# Part 2 is more complex because there can be overlapping texts.

def find_digits2(line):
    digits = []

    for start_index in range(0, len(line)):
        sub_line = line[start_index:]
        if sub_line[0].isdigit():
            digits.append(int(sub_line[0]))
        elif sub_line.startswith('one'):
            digits.append(1)
        elif sub_line.startswith('two'):
            digits.append(2)
        elif sub_line.startswith('three'):
            digits.append(3)
        elif sub_line.startswith('four'):
            digits.append(4)
        elif sub_line.startswith('five'):
            digits.append(5)
        elif sub_line.startswith('six'):
            digits.append(6)
        elif sub_line.startswith('seven'):
            digits.append(7)
        elif sub_line.startswith('eight'):
            digits.append(8)
        elif sub_line.startswith('nine'):
            digits.append(9)
    return digits


example2_lines = read_lines_from_file('./inputs/day1_example2.txt')
calibration_values = [find_calibration_value(line, find_digits2) for line in example2_lines]
print("part 2 example = " + str(sum(calibration_values)))

calibration_values = [find_calibration_value(line, find_digits2) for line in lines]
print("part 2 = " + str(sum(calibration_values)))
