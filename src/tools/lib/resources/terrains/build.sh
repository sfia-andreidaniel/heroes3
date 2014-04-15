#!/bin/bash
echo "terrains/dirt"
cd dirt
php ../resource-create.php > dirt.json
echo "terrains/grass"
cd ../grass
php ../resource-create.php > grass.json
echo "terrains/lava"
cd ../lava
php ../resource-create.php > lava.json
echo "terrains/rockie"
cd ../rockie
php ../resource-create.php > rockie.json
echo "terrains/rough"
cd ../rough
php ../resource-create.php > rough.json
echo "terrains/sand"
cd ../sand
php ../resource-create.php > sand.json
echo "terrains/snow"
cd ../snow
php ../resource-create.php > snow.json
echo "terrains/subteranean"
cd ../subteranean
php ../resource-create.php > subteranean.json
echo "terrains/swamp"
cd ../swamp
php ../resource-create.php > swamp.json
echo "terrains/water"
cd ../water
php ../resource-create.php > water.json
echo "terrains were built"
cd ..

rm _build/*.json

cp dirt/dirt.json _build/dirt.json
cp grass/grass.json _build/grass.json
cp lava/lava.json _build/lava.json
cp rockie/rockie.json _build/rockie.json
cp rough/rough.json _build/rough.json
cp sand/sand.json _build/sand.json
cp snow/snow.json _build/snow.json
cp subteranean/subteranean.json _build/subteranean.json
cp swamp/swamp.json _build/swamp.json
cp water/water.json _build/water.json