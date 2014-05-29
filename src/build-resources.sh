#!/bin/bash

echo "build resources..."
echo "resources/tools/objects-list.json"
php resources/tools/objects.php > resources/tools/objects-list.json
echo "resources/tools/artifacts-list.json"
php resources/tools/artifacts-list.php > resources/tools/artifacts-list.json
echo "resources/tools/creatures-list.json"
php resources/tools/creatures-list.php > resources/tools/creatures-list.json
echo "resources/tools/factions-list.json"
php resources/tools/faction.php "do=list" > resources/tools/factions-list.json
echo "resources/tools/dwellings-list.json"
php resources/tools/dwellings-list.php > resources/tools/dwellings-list.json
echo "resources/tools/mines-list.json"
php resources/tools/mines-list.php > resources/tools/mines-list.json
echo "resources/tools/resources-list.json"
php resources/tools/resources-list.php > resources/tools/resources-list.json
echo "resources/tools/castles-list.json"
php resources/tools/castles-list.php > resources/tools/castles-list.json
echo "..."

echo "done";