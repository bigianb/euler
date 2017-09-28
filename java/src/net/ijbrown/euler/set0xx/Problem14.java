package net.ijbrown.euler.set0xx;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.Map;

/**
 * Longest collaz sequence
 */
public class Problem14
{
    public static void main(String[] args)
    {
        new Problem14().run();
    }

    // Maps a start number to a sequence length
    private Map<Long, Long> sequenceLengths= new HashMap<>();

    private long findSequeunceLength(long startValue)
    {
        long val = startValue;
        long remainingLen = 0;
        Deque<Long> sequence = new ArrayDeque<>();
        while (remainingLen == 0){
            sequence.addLast(val);
            long nextVal = ((val & 1) == 1) ? val * 3 + 1: val/2;
            if (sequenceLengths.containsKey(nextVal)){
                remainingLen = sequenceLengths.get(nextVal);
            }
            val = nextVal;
        }

        while (!sequence.isEmpty()){
            long seqLen = sequence.size() + remainingLen;
            Long v = sequence.removeFirst();
            sequenceLengths.put(v, seqLen);
        }

        return sequenceLengths.get(startValue);
    }

    private void run()
    {
        long longest=0;
        long longestStartingVal=0;
        sequenceLengths.put(1L, 1L);
        for (long i=2; i<1000000; ++i){
            long len = findSequeunceLength(i);
            if (len > longest){
                longest = len;
                longestStartingVal = i;
            }
        }
        System.out.println(longestStartingVal);
    }
}
