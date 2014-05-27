#!/bin/bash

echo "building code..."
echo "..."
tsc --out index.js --target ES5 main.ts
echo "..."
echo "building resources..."
echo "..."

echo "resources/tools/objects-list.json"
php resources/tools/objects.php > resources/tools/objects-list.json
echo "resources/tools/artifacts-list.json"
php resources/tools/artifacts-list.php > resources/tools/artifacts-list.json
echo "resources/tools/creatures-list.json"
php resources/tools/creatures-list.php > resources/tools/creatures-list.json
echo "resources/tools/factions-list.json"
php resources/tools/faction.php "do=list" > resources/tools/factions-list.json
echo "..."

echo "done";