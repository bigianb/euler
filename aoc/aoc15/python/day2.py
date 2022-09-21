def readFile(filepath):
    with open(filepath, "r") as f:
        return [line.strip() for line in f.readlines()]

def solve(depths):
    totalPaper = 0
    totalRibbon = 0

    for x in depths:
        xyz = [int(el) for el in x.split("x")]
        face1 = xyz[0] * xyz[1]
        face2 = xyz[0] * xyz[2]
        face3 = xyz[1] * xyz[2]

        minFace = min(face1, face2, face3)

        paperRequired = 2 * (face1 + face2 + face3) + minFace
    
        totalPaper += paperRequired

        maxSide = max(xyz[0], xyz[1], xyz[2])
        perim = 2 * (xyz[0] + xyz[1] + xyz[2] - maxSide)
        ribbonRequired = perim + xyz[0] * xyz[1] * xyz[2]
        totalRibbon += ribbonRequired
        

    return (totalPaper, totalRibbon)

depths = readFile('./inputs/day2.txt')
solution = solve(depths)
print("Total Paper = ", solution[0], ", total Ribbon = ", solution[1])

