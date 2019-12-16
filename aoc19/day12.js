/*

To apply gravity, consider every pair of moons.
On each axis (x, y, and z), the velocity of each moon changes by
exactly +1 or -1 to pull the moons together.
For example, if Ganymede has an x position of 3, and Callisto has a x position of 5,
 then Ganymede's x velocity changes by +1 (because 5 > 3) and
 Callisto's x velocity changes by -1 (because 3 < 5).
 However, if the positions on a given axis are the same,
 the velocity on that axis does not change for that pair of moons.

Once all gravity has been applied, apply velocity:
simply add the velocity of each moon to its own position.
For example, if Europa has a position of x=1, y=2, z=3 and a velocity of x=-2, y=0,z=3,
then its new position would be x=-1, y=2, z=6.
This process does not modify the velocity of any moon.

*/

const initMoonPos = [
    {x:1, y:2, z:-9},
    {x:-1, y:-9, z:-4},
    {x:17, y:6, z:8},
    {x:12, y:4, z:2}
]

const pairs = [
    [0,1],[0,2],[0,3],
    [1,2],[1,3],
    [2,3]
]

function initMoons(moons_in){
    let moons = []
    for (let moon_in of moons_in){
        let moon = {...moon_in, vx:0, vy:0, vz:0}
        moons.push(moon);
    }
    return moons;
}

function calcGravity(moons)
{
    for (let pair of pairs){
        let moon1 = moons[pair[0]];
        let moon2 = moons[pair[1]];
        if (moon1.x > moon2.x){
            moon1.vx -= 1;
            moon2.vx += 1;
        } else if (moon1.x < moon2.x){
            moon1.vx += 1;
            moon2.vx -= 1;
        }
        if (moon1.y > moon2.y){
            moon1.vy -= 1;
            moon2.vy += 1;
        } else if (moon1.y < moon2.y){
            moon1.vy += 1;
            moon2.vy -= 1;
        }
        if (moon1.z > moon2.z){
            moon1.vz -= 1;
            moon2.vz += 1;
        } else if (moon1.z < moon2.z){
            moon1.vz += 1;
            moon2.vz -= 1;
        }
    }
}

function applyVelocity(moons)
{
    for (let moon of moons){
        moon.x += moon.vx;
        moon.y += moon.vy;
        moon.z += moon.vz;
    }
}

function calcTotalEnergy(moon)
{
    let ke = Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z);
    let pe = Math.abs(moon.vx) + Math.abs(moon.vy) + Math.abs(moon.vz);
    return ke*pe;
}

function simulate(steps, moons_in)
{
    let moons = initMoons(moons_in);
    for (let step=0; step<steps; ++step){
        calcGravity(moons);
        applyVelocity(moons);
    }
    let totalEngergy = 0;
    for (let moon of moons){
        totalEngergy += calcTotalEnergy(moon);
    }
    console.log('total energy = ' + totalEngergy)
}

function buildKey(moons, axis)
{
    let key='';
    for (let moon of moons){
        if (axis === 'x'){
            key += moon.x + ',' + moon.vx;
        }
        if (axis === 'y'){
            key += moon.y + ',' + moon.vy;
        }
        if (axis === 'z'){
            key += moon.z + ',' + moon.vz;
        }
    }
    return key;
}

function findFirstRepeat(moons_in, axis){
    let moons = initMoons(moons_in);
    let prev_states={}
    let step=0;
    let done=false;
    let velKey = 'v'+axis;
    do{
        calcGravity(moons);
        applyVelocity(moons);
        ++step;
        done=true;
        for (let i in moons){
            if (!(moons_in[i][axis] === moons[i][axis] && 0 === moons[i][velKey])){
                done = false;
            }
        }

        
    } while (!done);
    console.log('first repeat at step ' + step + ' for ' + axis);
}

simulate(1000, initMoonPos);

findFirstRepeat(initMoonPos, 'x');
findFirstRepeat(initMoonPos, 'y');
findFirstRepeat(initMoonPos, 'z');

// now find the LCM
