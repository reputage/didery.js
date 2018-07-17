#!/usr/bin/env bash

set -o errexit

git stash save 'Before Testing'
git clone https://github.com/reputage/didery.git
cd didery
git checkout dev
cd ..
pip3 install -e didery
dideryd -p 8080 .consensys/didery/db