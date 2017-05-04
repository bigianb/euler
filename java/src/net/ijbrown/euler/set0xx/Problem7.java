package net.ijbrown.euler.set0xx;

/**
 * Problem 7 of project Euler.
 *
 * What is the 10 001st prime number?
 */
public class Problem7
{
    private void run()
    {
        long prime=2;
        int i=1;
        while (i <= 10001){
            prime = nextPrime(prime);
            ++i;
        }
        System.out.println(prime);
    }

    private long nextPrime(long start){
        long prime = start+1;
        if (prime % 2 == 0){
            prime += 1;
        }
        while (!isPrime(prime)){
            prime += 2;
        }
        return prime;
    }


    private boolean isPrime(long candidate)
    {
        if (candidate == 2 || candidate ==3){
            return true;
        }
        if ((candidate & 1) == 0){
            return false;
        }
        long upperLimit = candidate / 2;
        for (long divisor = 5; divisor < upperLimit; divisor += 2){
            if (candidate % divisor == 0){
                return false;
            }
        }
        return true;
    }


    public static void main(String[] args)
    {
        new Problem7().run();
    }
}
