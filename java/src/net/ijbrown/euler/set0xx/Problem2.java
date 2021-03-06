package net.ijbrown.euler.set0xx;

/**
 * Problem 2 of project Euler.
 *
 * Each new term in the Fibonacci sequence is generated by adding the previous two terms.
 * By starting with 1 and 2, the first 10 terms will be:
 *
 * 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...
 *
 * By considering the terms in the Fibonacci sequence whose values do not exceed four million,
 * find the sum of the even-valued terms.
 */
public class Problem2
{
    public static void main(String[] args)
    {
        int sum=0;
        int term1=1;
        int term2=1;
        int term3=2;
        while (term3 < 4000000){
            sum += term3;
            term1 = term2 + term3;
            term2 = term3 + term1;
            term3 = term1 + term2;
        }
        System.out.println(Integer.toString(sum));
    }
}
