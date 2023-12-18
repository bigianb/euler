import sys
sys.setrecursionlimit(100000)

def read_lines_from_file(filepath):
    with open(filepath, "r") as f:
        return [line.strip() for line in f.readlines()]


def parse_line(line):
    [direction, distance, colour] = line.split(' ')
    return {'direction': direction, 'distance': int(distance), 'colour': colour}

def find_inside_point(rows):

    for x in range(0, len(rows[0])):
        if rows[0][x] != '.' and rows[1][x] == '.':
            return (x, 1)

    raise('could not find an inside point')

def flood_fill(x, y, rows):
    rows[y][x] = '#'
    if (x > 0 and rows[y][x-1] == '.'):
        flood_fill(x-1, y, rows)
    if (x < len(rows[0])-1 and rows[y][x+1] == '.'):
        flood_fill(x+1, y, rows)
    if (y > 0 and rows[y-1][x] == '.'):
        flood_fill(x, y-1, rows)
    if (y < len(rows)-1 and rows[y+1][x] == '.'):
        flood_fill(x, y+1, rows)
    

def part1(instructions):

    trench = {}
    xpos = 0
    ypos = 0

    miny = 0
    maxy = 0
    minx = 0
    maxx = 0

    trench[(0,0)] = '#'
    for instruction in instructions:
        d = instruction['direction']
        for step in range(0, instruction['distance']):
            if d == 'U':
                ypos -= 1
            elif d == 'D':
                ypos += 1
            elif d == 'L':
                xpos -= 1
            elif d == 'R':
                xpos += 1

            trench[(xpos, ypos)] = instruction
            if ypos < miny:
                miny = ypos
            if ypos > maxy:
                maxy = ypos
            if xpos < minx:
                minx = xpos
            if xpos > maxx:
                maxx = xpos

    rows = [['.' for x in range(minx, maxx+1)] for y in range(miny, maxy+1)]

    xadj = 0 - minx
    yadj = 0 - miny

    for (x, y), inst in trench.items():
        rows[y + yadj][x + xadj] = '#'

    (x0, y0) = find_inside_point(rows)
    flood_fill(x0, y0, rows)

    sum = 0
    for row in rows:
        for c in row:
            if c != '.':
                sum += 1
        #print("".join(row))

    return sum


def find_vertices(instructions):
    here = (0,0)
    vertices = [here]
    perimeter = 0
    for instruction in instructions:
        distance = instruction['distance']
        match instruction['direction']:
            case 'R': here = (here[0] + distance, here[1])
            case 'L': here = (here[0] - distance, here[1])
            case 'U': here = (here[0], here[1] - distance)
            case 'D': here = (here[0], here[1] + distance)
            case _: raise ('unknown dir')
        vertices.append(here)
        perimeter += distance
    return vertices, perimeter

# https://en.wikipedia.org/wiki/Shoelace_formula
def shoelace(vertices, perimeter):
    area = 0
    for i in (range(len(vertices) - 1)):
        area += vertices[i][0] * vertices[i + 1][1]
        area -= vertices[i][1] * vertices[i + 1][0]
    area += perimeter
    return (area // 2) + 1

def area_via_shoelace(instructions):
    vertices, perimeter = find_vertices(instructions)
    return shoelace(vertices, perimeter)

example_input = read_lines_from_file('./inputs/day18_example.txt')
example_instructions = [parse_line(line) for line in example_input]
print(part1(example_instructions))
print(area_via_shoelace(example_instructions))

real_input = read_lines_from_file('./inputs/day18.txt')
real_instructions = [parse_line(line) for line in real_input]
print(part1(real_instructions))
print(area_via_shoelace(real_instructions))


# Each hexadecimal code is six hexadecimal digits long.
# The first five hexadecimal digits encode the distance in meters as a five-digit hexadecimal number.
# The last hexadecimal digit encodes the direction to dig: 0 means R, 1 means D, 2 means L, and 3 means U.

def parse_line2(line):
    [_, _, code] = line.split(' ')
    match code[7]:
        case '0': direction = 'R'
        case '1': direction = 'D'
        case '2': direction = 'L'
        case '3': direction = 'U'
        case _: raise ('invalid direction code')
    dstr = code[2:7]
    return {'direction': direction, 'distance': int("0x"+dstr, 0)}

example_instructions = [parse_line2(line) for line in example_input]
print(area_via_shoelace(example_instructions))

real_instructions = [parse_line2(line) for line in real_input]
print(area_via_shoelace(real_instructions))
