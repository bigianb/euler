package net.ijbrown.euler.set0xx;

/**
 * A palindromic number reads the same both ways.
 * The largest palindrome made from the product of two 2-digit numbers is 9009 = 91 × 99.
 *
 * Find the largest palindrome made from the product of two 3-digit numbers.
 */
public class Problem4
{
    public static void main(String[] args)
    {
        new Problem4().bruteForce();
    }

    private void bruteForce()
    {
        long largerstPalindrome=0;
        for (int i=100; i<1000; ++i){
            for (int j=100; j<1000; ++j){
                long candidate = i*j;
                if (candidate > largerstPalindrome){
                    if (isPalindrome(candidate)){
                        largerstPalindrome = candidate;
                    }
                }
            }
        }
        System.out.println(largerstPalindrome);
    }

    private boolean isPalindrome(long candidate)
    {
        String s = Long.toString(candidate);
        int len = s.length();
        for (int i=0; i<len/2; ++i){
            if (s.charAt(i) != s.charAt(len-1-i)){
                return false;
            }
        }
        return true;
    }
}
