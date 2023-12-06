package aco23;

import java.io.IOException;
import java.nio.file.Path;

public class Day3 {

    public static void main(String[] args) throws IOException {
        EngineSchematic exampleSchematic = new EngineSchematic();
        exampleSchematic.read(Path.of("inputs/day3_example.txt"));

        int sum=0;
        for (var pn : exampleSchematic.partNumbers){
            sum += pn.num();
        }
        System.out.println("Example part 1 = " + sum);

        var gears = exampleSchematic.getGears();
        int ratios = 0;
        for (var gear : gears){
            ratios += gear.get(0).num() * gear.get(1).num();
        }
        System.out.println("Example part 2 = " + ratios);

        EngineSchematic schematic = new EngineSchematic();
        schematic.read(Path.of("inputs/day3.txt"));
        sum=0;
        for (var pn : schematic.partNumbers){
            sum += pn.num();
        }
        System.out.println("Part 1 = " + sum);

        gears = schematic.getGears();
        ratios = 0;
        for (var gear : gears){
            ratios += gear.get(0).num() * gear.get(1).num();
        }
        System.out.println("Part 2 = " + ratios);
    }

}
