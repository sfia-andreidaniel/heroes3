#!/bin/bash
echo "rivers/icy"
cd icy
php ../resource-create.php > icy.json

echo "rivers/lava"
cd ../lava
php ../resource-create.php > lava.json

echo "rivers/mud"
cd ../mud
php ../resource-create.php > mud.json

echo "rivers/river"
cd ../river
php ../resource-create.php > river.json

echo "rivers were built"
cd ..

rm _build/*.json

cp icy/icy.json _build/icy.json
cp lava/lava.json _build/lava.json
cp mud/mud.json _build/mud.json
cp river/river.json _build/river.json
