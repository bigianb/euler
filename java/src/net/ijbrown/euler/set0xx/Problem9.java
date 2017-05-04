package net.ijbrown.euler.set0xx;

/**
 * A Pythagorean triplet is a set of three natural numbers, a < b < c, for which,
 *
 * a2^ + b^2 = c^2
 * For example, 3^2 + 4^2 = 9 + 16 = 25 = 5^2.
 *
 * There exists exactly one Pythagorean triplet for which a + b + c = 1000.
 * Find the product abc.
 */
public class Problem9
{
    public static void main(String[] args)
    {
        new Problem9().run(1000);
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
