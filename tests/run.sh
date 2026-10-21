#!/bin/sh
# Run the API tests (Node 22+, no dependencies). Usage: sh tests/run.sh   (same as: node --test tests/*.test.js)
cd "$(dirname "$0")/.." && exec node --test tests/*.test.js
