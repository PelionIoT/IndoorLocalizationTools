#!/bin/bash

RANGE=150
cycle=0
#for i in `seq 1 100`;
while :;
do
#R=$RANDOM
##R = $[$R % $RANGE]
#let "R %= $RANGE"
#let "R += 150"
#
#G=$RANDOM
##G = $[$G % $RANGE]
#let "G %= $RANGE"
#let "G += 150"
#
#B=$RANDOM
##B = $[$B % $RANGE]
#let "B %= $RANGE"
#let "G += 150"

R=255
G=255
B=255

node send-bytes -d aaaa:0000:0000:0000:02a5:0900:001a:0bbb -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,$R,0,0,0,0,1,0,0x7c,0x20                                                                                                                                                               
node send-bytes -d aaaa:0000:0000:0000:02a5:0900:008e:8826 -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,$R,0,0,0,0,1,0,0x7c,0x20                                                                                                                                                               
node send-bytes -d aaaa:0000:0000:0000:02a5:0900:00ce:0173 -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,$R,0,0,0,0,1,0,0x7c,0x20                                                                                                                                                               
node send-bytes -d aaaa:0000:0000:0000:02a5:0900:008d:5577 -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,$R,0,0,0,0,1,0,0x7c,0x20                                                                                                                                                               
node send-bytes -d aaaa:0000:0000:0000:02a5:0900:0002:0ede -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,$R,0,0,0,0,1,0,0x7c,0x20

let "cycle++"
echo $cycle
sleep 1

node send-bytes -d aaaa:0000:0000:0000:02a5:0900:001a:0bbb -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,0,$G,0,0,0,1,0,0x7c,0x20                                                                                                                                                               
node send-bytes -d aaaa:0000:0000:0000:02a5:0900:008e:8826 -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,0,$G,0,0,0,1,0,0x7c,0x20                                                                                                                                                               
node send-bytes -d aaaa:0000:0000:0000:02a5:0900:00ce:0173 -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,0,$G,0,0,0,1,0,0x7c,0x20                                                                                                                                                               
node send-bytes -d aaaa:0000:0000:0000:02a5:0900:008d:5577 -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,0,$G,0,0,0,1,0,0x7c,0x20                                                                                                                                                               
node send-bytes -d aaaa:0000:0000:0000:02a5:0900:0002:0ede -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,0,$G,0,0,0,1,0,0x7c,0x20

let "cycle++"
echo $cycle
sleep 1

node send-bytes -d aaaa:0000:0000:0000:02a5:0900:001a:0bbb -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,0,0,$B,0,0,1,0,0x7c,0x20                                                                                                                                                               
node send-bytes -d aaaa:0000:0000:0000:02a5:0900:008e:8826 -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,0,0,$B,0,0,1,0,0x7c,0x20                                                                                                                                                               
node send-bytes -d aaaa:0000:0000:0000:02a5:0900:00ce:0173 -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,0,0,$B,0,0,1,0,0x7c,0x20                                                                                                                                                               
node send-bytes -d aaaa:0000:0000:0000:02a5:0900:008d:5577 -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,0,0,$B,0,0,1,0,0x7c,0x20                                                                                                                                                               
node send-bytes -d aaaa:0000:0000:0000:02a5:0900:0002:0ede -dp 3001 -sp 3000 -c wwbulb.js -exec enableMode 0xf,0,0,$B,0,0,1,0,0x7c,0x20

let "cycle++"
echo $cycle
sleep 1
done

