use std::fs;

fn main()
{
    let input = fs::read_to_string("../inputs/day2.txt").expect("Failed to read input");

    let result = run(input);
    println!("{}, {}", result.0, result.1);
}

fn run(input: String) -> (i32, i32)
{
    let lines = input.lines();
    let mut total = (0, 0);
    for line in lines
    {
        let lval = run_line(line.to_string());
        total.0 += lval.0;
        total.1 += lval.1;
    }
    total
}

fn run_line(input: String) -> (i32, i32)
{
    let mut parts = input.split("x");
    let x: i32= parts.next().expect("x").parse().unwrap();
    let y: i32= parts.next().expect("y").parse().unwrap();
    let z: i32= parts.next().expect("z").parse().unwrap();

    let s1 = x*y;
    let s2 = x*z;
    let s3 = y*z;

    let min = s1.min(s2).min(s3);

    (2 * (s1 + s2 + s3) + min, calc_ribbon(x, y, z))
}

fn calc_ribbon(x: i32, y: i32, z: i32) -> i32
{
    let max = x.max(y).max(z);
    let perim = 2 * (x + y + z - max);
    perim + x * y * z
}

#[test]
fn example()
{
    assert_eq!(58, run_line("2x3x4".to_string()).0);
    assert_eq!(34, run_line("2x3x4".to_string()).1);
    assert_eq!(58, run("2x3x4".to_string()).0);
}