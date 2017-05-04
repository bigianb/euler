package net.ijbrown.euler.set0xx;

/**
 * Find the difference between the sum of the squares of the first one hundred natural numbers and the square of the sum.
 */
public class Problem6
{
    public static void main(String[] args)
    {
        new Problem6().run();
    }

    private void run()
    {
        int sumSq=0;
        int sum=0;
        for (int i=1; i <= 100; ++i){
            sumSq += i*i;
            sum += i;
        }

        System.out.println(sum*sum - sumSq);
    }
}
