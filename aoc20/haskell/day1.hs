import System.IO
main :: IO ()
main = do
   helloFile <- openFile "../inputs/day1.txt" ReadMode
   hasLine <- hIsEOF helloFile
   firstLine <- if not hasLine
                then hGetLine helloFile
                else return "empty"
   putStrLn "done!"