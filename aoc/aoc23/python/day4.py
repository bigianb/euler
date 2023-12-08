def read_lines_from_file(filepath):
    with open(filepath, "r") as f:
        return [line.strip() for line in f.readlines()]


def parse_line(line):
    [card_str, numbers] = line.split(':')
    [winners_str, card_nos_str] = numbers.split('|')

    winners = [int(n) for n in winners_str.split()]
    numbers = [int(n) for n in card_nos_str.split()]

    return {'winners': winners, 'numbers': numbers, 'instances': 1}


def find_winners(card):
    return [num for num in card['numbers'] if num in card['winners']]


def winval(winners):
    num = len(winners)
    if num > 0:
        return 2 ** (num - 1)
    else:
        return 0


def part1(lines):
    cards = [parse_line(line) for line in lines]
    my_winners = [find_winners(card) for card in cards]
    return sum([winval(winners) for winners in my_winners])


ex = read_lines_from_file('./inputs/day4_example.txt')
print(part1(ex))

day4 = read_lines_from_file('./inputs/day4.txt')
print(part1(day4))


def part2(lines):
    cards = [parse_line(line) for line in lines]
    num_cards = len(cards)
    for card_id in range(0, num_cards):
        num_winners = len(find_winners(cards[card_id]))
        instances = cards[card_id]['instances']
        for won_card_id in range(card_id+1, card_id+1+num_winners):
            cards[won_card_id]['instances'] = cards[won_card_id]['instances'] + instances

    return sum([card['instances'] for card in cards])


print(part2(ex))
print(part2(day4))