const fs = require('fs');

function readFromFile(filename)
{
    const fileData = fs.readFileSync(filename, 'utf8');
    const lines = fileData.split(/\r?\n/);
    let input = {};
    let path=[];
    lines.forEach(line => {
        let parts = line.split(' ');
        if (parts[0] === '$'){
            if (parts[1] === 'cd'){
                if (parts[2] === '/'){
                    path = [];
                } else if(parts[2] === '..'){
                    path.pop();
                } else {
                    path.push(parts[2]);
                }
            } else if(parts[1] === 'ls'){

            } else {
                throw ('unknown command ' + parts[1]);
            }
        } else if (parts[0] === 'dir'){
            const dirName = parts[1];
            createDir(input, path, dirName);
        } else {
            const size = Number.parseInt(parts[0]);
            const filename = parts[1];
            addFile(input, path, filename, size);
        }
    });
    calcDirSizes(input);
    return input;
}

// Assumes there is no directory called files or size.
function calcDirSizes(dir)
{
    let size = 0;
    Object.keys(dir).forEach(key => {
        if (key === 'files'){
            Object.values(dir.files).forEach(v => size += v);
        } else if (key !== 'size') {
            size += calcDirSizes(dir[key]);
        }
    });
    dir.size = size;
    return size;
}

function createDir(input, path, dirName)
{
    if (dirName === 'files' || dirName === 'size'){
        throw ('found reserved dir name ' + dirName);
    }
    let obj = input;
    path.forEach(el => {
        if (!obj[el]){
            obj[el] = {};
        }
        obj = obj[el];
    });
    if (dirName && !obj[dirName]){
        obj[dirName] = {};
    }
    return obj;
}

function addFile(input, path, filename, size)
{
    let obj = createDir(input, path);
    if (!obj.files){
        obj.files = {};
    }
    obj.files[filename] = size;
}

function filterDirs(filesys, predicate)
{
    let dirs = [];
    if (predicate(filesys)){
        dirs.push(filesys);
    }
    Object.keys(filesys).forEach(key => {
        if (key !== 'files' && key !== 'size'){
            let d = filterDirs(filesys[key], predicate);
            if (d && d.length > 0){
                dirs.push(...d);
            }
        }
    });
    return dirs;
}

function part1(filesys)
{
    let dirs = filterDirs(filesys, entry => entry.size < 100000);
    let sum=0;
    dirs.forEach(dir => sum += dir.size);
    return sum;
}

function part2(filesys)
{
    const TOTAL_SPACE = 70000000;
    const REQUIRED_SPACE = 30000000;

    const currentUnusedSpace = TOTAL_SPACE - filesys.size;
    const requiredDeletion = REQUIRED_SPACE - currentUnusedSpace;

    console.log('need to find ' + requiredDeletion + ' bytes');

    let dirs = filterDirs(filesys, entry => entry.size >= requiredDeletion);

    let min=TOTAL_SPACE;
    dirs.forEach(dir => {if (dir.size < min) {min = dir.size}});
    return min;
}

let input = readFromFile('../inputs/day7_example.txt');
console.log("part 1 example = " + part1(input));
console.log("part 2 example = " + part2(input));

input = readFromFile('../inputs/day7.txt');
console.log("part 1 = " + part1(input));
console.log("part 2 = " + part2(input));