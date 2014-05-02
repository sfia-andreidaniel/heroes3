#!/bin/bash
echo "roads/dirt"
cd dirt
php ../resource-create.php > dirt.json
echo "roads/pavement"
cd ../pavement
php ../resource-create.php > pavement.json
echo "roads/stone"
cd ../stone
php ../resource-create.php > stone.json
echo "roads were built"
cd ..

rm _build/*.json

cp dirt/dirt.json _build/dirt.json
cp pavement/pavement.json _build/pavement.json
cp stone/stone.json _build/stone.json