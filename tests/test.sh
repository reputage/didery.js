#!/usr/bin/env bash

set -o errexit

git stash save 'Before Testing'
pip3 install -r requirements.txt
virtualenv .virtualenvs
#git clone https://github.com/reputage/didery.js.git
#git checkout dev
git stash pop