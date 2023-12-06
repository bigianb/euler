package aco23;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import static java.nio.file.Files.readAllLines;

public class EngineSchematic {

     record PartNo(int num, int x0, int x1, int y) { }

    List<String> lines;
    int width, height;

    List<PartNo> partNumbers = new ArrayList<>();

    public void read(Path path) throws IOException {
        lines = readAllLines(path, StandardCharsets.US_ASCII);
        width = lines.get(0).length();
        height = lines.size();

        findPartNumbers();
    }

    public char getCharAt(int x, int y)
    {
        if (x < 0 || y < 0 || x >= width || y >= height){
            return '.';
        }
        return lines.get(y).charAt(x);
    }

    public void findPartNumbers()
    {
        for (int y=0; y<height; ++y){
            int curPartNo = -1;
            int x0 = -1;
            int x1 = -1;
            for (int x=0; x<=width; ++x){
                var c = getCharAt(x, y);
                if (Character.isDigit(c)){
                    int digit = Character.digit(c, 10);
                    if (curPartNo < 0){
                        // first digit of a new part
                        curPartNo = digit;
                        x0 = x;
                    } else {
                        curPartNo = curPartNo * 10 + digit;
                        x1 = x;
                    }
                } else {
                    if (curPartNo >= 0){
                        var pn = new PartNo(curPartNo, x0, x1, y);
                        partNumbers.add(pn);
                    }
                    curPartNo = -1;
                    x0 = -1;
                    x1 = -1;
                }
            }
        }
        System.out.println("Found " + partNumbers.size() + " part numbers");
    }
}
