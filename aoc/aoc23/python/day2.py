def read_lines_from_file(filepath):
    with open(filepath, "r") as f:
        return [line.strip() for line in f.readlines()]


def parse_draw(draw):
    parts = draw.split(',')
    balls = {}
    for part in parts:
        [val, colour] = part.split()
        balls[colour.strip()] = int(val)
    return balls


def parse_line(line):
    [game_id_str, draws_part] = line.split(':');
    game_id = int(game_id_str[5:])
    draws = draws_part.split(';')
    game = {'id': game_id, 'sets': [parse_draw(draw) for draw in draws]}
    return game


def possible(sets, bag):
    ok = True
    for set in sets:
        for key in set.keys():
            if key not in bag:
                ok = False
            elif bag[key] < set[key]:
                ok = False
    return ok


def filter_possible(games, bag):
    return [game for game in games if possible(game['sets'], bag)]


def part1(lines, bag):
    games = [parse_line(line) for line in lines]
    possibles = filter_possible(games, bag)
    sum = 0
    for game in possibles:
        sum += game['id']
    return sum


day2Ex = read_lines_from_file('./inputs/day2_example1.txt')
the_bag = {'red': 12, 'green': 13, 'blue': 14}
print(part1(day2Ex, the_bag))

day2 = read_lines_from_file('./inputs/day2.txt')
print(part1(day2, the_bag))


def part2(lines):
    games = [parse_line(line) for line in lines]

    result = 0
    for game in games:
        min_bag = {}
        for set in game['sets']:
            for colour in set.keys():
                val = set[colour]
                if colour not in min_bag:
                    min_bag[colour] = val
                elif min_bag[colour] < val:
                    min_bag[colour] = val
        power = 1
        for v in min_bag.values():
            power *= v
        result += power
    return result


print(part2(day2Ex))
print(part2(day2))