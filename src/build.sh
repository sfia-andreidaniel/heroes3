#!/bin/bash

echo "building code..."
tsc --out index.js --target ES5 main.ts
echo "done";