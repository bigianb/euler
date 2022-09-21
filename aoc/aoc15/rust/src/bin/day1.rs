use std::fs;

fn main()
{
    let input = fs::read_to_string("../inputs/day1.txt").expect("Failed to read input");

    let mut floor = 0;
    let mut position = 1;
    let mut first_basement = 0;
    for c in input.chars() {
        
        floor += match c
        {
            '(' => 1,
            ')' => -1,
            _ => 0,
        };

        if floor < 0 && first_basement == 0 {
            first_basement = position;
        }

        position += 1;
    }
    println!("End floor = {}, first basement positon = {}", floor, first_basement);
}