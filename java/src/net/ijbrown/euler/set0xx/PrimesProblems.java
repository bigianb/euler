package net.ijbrown.euler.set0xx;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Problems with prime numbers
 */
public class PrimesProblems
{
    /**
     * Problem 7 of project Euler.
     *
     * What is the 10 001st prime number?
     */
    private void runProblem7()
    {
        long prime=2;
        int i=1;
        while (i < 10001){
            prime = nextPrime(prime);
            ++i;
        }
        System.out.println("Problem 7: " + prime);
    }

    /**
     * The sum of the primes below 10 is 2 + 3 + 5 + 7 = 17.
     *
     * Find the sum of all the primes below two million.
     */
    private void runProblem10()
    {
        long prime=2;
        long sum=0;
        while (prime < 2000000){
            sum += prime;
            prime = nextPrime(prime);
        }
        System.out.println("Problem 10: " + sum);
    }


    /**
     * What is the value of the first triangle number to have over five hundred divisors?
     */
    private void runProblem12()
    {
        System.out.println("num divisors of 28 = " + numDivisors(28L));
        System.out.println("num divisors of 48 = " + numDivisors(48L)); // should be 10
        long triangleNumer = 28;
        long index=8;

        long numDivisors;
        do {
            triangleNumer += index;
            ++index;
            numDivisors = numDivisors(triangleNumer);
            System.out.println("" + triangleNumer + " has " + numDivisors + " divisors");
        } while (numDivisors <= 500);
        System.out.println("number = " + triangleNumer);
    }

    private int numDivisors(Long val)
    {
        List<Long> primeFactors = getPrimeFactors(val);

        Map<Long, Long> primeDivisors = getPrimeDivisors(primeFactors, val);

        // If we have prime factors:  x^a, y^b then we have (a+1)(b+1) divisors
        // 28 has divisors 1,2,4,7,14,28
        // Prime factors are 2^2, 7 ... 1, 2, 2, 7
        // num divisors = (2+1)*(1+1) = 6

        int divisors=1;
        for (long exp: primeDivisors.values()){
            divisors *= (exp+1);
        }
        return divisors;
    }

    private Map<Long, Long> getPrimeDivisors(List<Long> primeFactors, Long val)
    {
        Map<Long, Long> divisors = new HashMap<>();
        for (Long prime : primeFactors){
            long times=0;
            long candidate = val;
            while (candidate % prime == 0){
                ++times;
                candidate /= prime;
            }
            divisors.put(prime, times);
        }
        return divisors;
    }

    private List<Long> getPrimeFactors(Long val)
    {
        List<Long> primeFactors = new ArrayList<>();
        long prime = 2;
        while (prime <= val){
            if (val % prime == 0){
                primeFactors.add(prime);
                val = val / prime;
            }
            prime = nextPrime(prime);
        }
        return primeFactors;
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
        for (long divisor = 3; divisor < upperLimit; divisor += 2){
            if (candidate % divisor == 0){
                return false;
            }
        }
        return true;
    }


    public static void main(String[] args)
    {
        new PrimesProblems().runProblem12();
     //   new PrimesProblems().runProblem7();
     //   new PrimesProblems().runProblem10();

    }


}
