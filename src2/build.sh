#!/bin/bash

tsc --out index.js --target ES5 main.ts
nodejs index.js