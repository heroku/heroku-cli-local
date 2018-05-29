#!/bin/bash

set -e

download() {
  local version="${1:?}"
  local platforms=(darwin linux win32)
  local extensions=(macos linux windows.exe)

  for ((i=0; i < ${#platforms[@]}; i++)); do
    echo "Downloading bin/heroku-local-${platforms[i]}..."
    curl --retry 3 -o bin/heroku-local-${platforms[i]} -L \
      https://github.com/heroku/heroku-local-build/releases/download/v${version}/heroku-local-${version}-${extensions[i]}
  done
}

download "$@"
