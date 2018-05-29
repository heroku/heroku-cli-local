#!/bin/bash

platforms=(darwin linux win32)
for ((i=0; i < ${#platforms[@]}; i++)); do
  if [ ! -f "bin/heroku-local-${platforms[i]}" ]; then
    echo " ! ERROR: Missing bin/heroku-local-${platforms[i]}"
    exit 1
  fi
done
