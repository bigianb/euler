
const input = 'target area: x=128..160, y=-142..-88';

function isValid(xv0, yv0, xmin, xmax, ymin, ymax)
{
    let xpos=0;
    let ypos=0;
    let xv = xv0;
    let yv = yv0;
    while (xpos <= xmax && ypos >= ymin)
    {
        if (xpos >= xmin && xpos <= xmax && ypos >= ymin && ypos <= ymax){
            return true;
        }
        xpos += xv;
        ypos += yv;
        --xv;
        if (xv < 0){
            xv = 0;
        }
        --yv;
    }
    return false;
}

function solve1(xmin, xmax, ymin, ymax)
{
    // find the set of possible x velocities.
    let validXV0s = new Set();
    for (let xv0=1; xv0<=xmax; ++xv0){
        let xpos = 0;
        let xv = xv0;
        while (xv > 0 && xpos <= xmax){
            if (xpos >= xmin && xpos <= xmax){
                validXV0s.add(xv0)
            }
            xpos += xv;
            --xv;
        }
    }

    // Now find the set of valid y velocities
    // Fire up with yv0 and it will start the descent with -(yv0+1)
    let highestYv0 = 0;
    let highestStep=0;
    let validYV0s = new Set();
    for (let yv0=-1; yv0>=ymin; --yv0){
        let ypos = 0;
        let yv = yv0;
        let step=0;
        while (ypos >= ymin){
            if (ypos >= ymin && ypos <= ymax){
                // yv0 of -4 is equivalent to upward of 3
                let upwardYv0 = -yv0 - 1;
                validYV0s.add(upwardYv0);
                if (upwardYv0 >= highestYv0){
                    highestYv0 = upwardYv0;
                    highestStep = step;
                }
            }
            ++step;
            ypos += yv;
            --yv;
        }
    }
    let maxYval = highestYv0/2 * (2 + highestYv0 - 1);
    console.log('part 1 ='+maxYval);

    let validVels = new Set();
    for (let xv0 of validXV0s){
        for (let yv0 of validYV0s){
            // for a vel of 3, we can also consider -4
            if (isValid(xv0, yv0, xmin, xmax, ymin, ymax)){
                validVels.add(''+xv0 + ','+yv0);
            }
            let altYv0 = -yv0 - 1;
            if (isValid(xv0, altYv0, xmin, xmax, ymin, ymax)){
                validVels.add(''+xv0 + ','+altYv0);
            }
        }
    }
    //console.log(JSON.stringify([...validVels]));
    console.log(validVels.size);
}

solve1(20, 30, -10, -5);
solve1(128, 160, -142, -88);
