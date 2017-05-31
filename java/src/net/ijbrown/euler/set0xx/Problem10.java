package net.ijbrown.euler.set0xx;

/**
 * The sum of the primes below 10 is 2 + 3 + 5 + 7 = 17.
 *
 * Find the sum of all the primes below two million.
 */
public class Problem10
{
    public static void main(String[] args)
    {
        new Problem10().run(1000);
    }

    private void run(int target)
    {
        int result=0;
        for (int a=1; a<1000 && result ==0; ++a){
            for (int b=a+1; b<1000-a; ++b){
                int lhs = a*a + b*b;
                int c = (int)Math.sqrt(lhs);
                if (lhs == c*c){
                    if (c > b && a + b + c == target){
                        result = a * b * c;
                        break;
                    }
                }
            }
        }
        System.out.println(result);
    }
}
