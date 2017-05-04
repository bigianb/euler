package net.ijbrown.euler.set0xx;

import java.util.ArrayList;
import java.util.List;

/**
 * Problem 3 of project Euler.
 *
 * The prime factors of 13195 are 5, 7, 13 and 29.
 *
 * What is the largest prime factor of the number 600851475143 ?
 */
public class Problem3
{
    private void run(long val)
    {
        List<Long> primeFactors = new ArrayList<>();
        long prime = 3;
        while (prime <= val){
            if (val % prime == 0){
                primeFactors.add(prime);
                val = val / prime;
            }
            prime = nextPrime(prime);
        }
        System.out.println(primeFactors);
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
        new Problem3().run(13195);
        new Problem3().run(600851475143L);
    }
}
