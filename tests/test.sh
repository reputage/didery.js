#!/usr/bin/env bash

set -o errexit

git stash save 'Before Testing'
pip3 install -r tests/requirements.txt
virtualenv .virtualenvs
source .virtualenvs/bin/activate
#git clone https://github.com/reputage/didery.js.git
#git checkout dev
deactivate
git stash pop