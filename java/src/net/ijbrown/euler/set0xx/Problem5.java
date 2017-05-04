package net.ijbrown.euler.set0xx;

/**
 * 2520 is the smallest number that can be divided by each of the numbers from 1 to 10 without any remainder.
 *
 * What is the smallest positive number that is evenly divisible by all of the numbers from 1 to 20?
 */
public class Problem5
{
    public static void main(String[] args)
    {
        new Problem5().run();
    }

    private void run()
    {
        long candidate = 2520-20;
        boolean divisible = false;
        while (!divisible){
            divisible = true;
            candidate += 20;
            for (int i=2; i<=20 && divisible; ++i){
                divisible = candidate % i == 0;
            }

        }
        System.out.println(candidate);
    }
}
