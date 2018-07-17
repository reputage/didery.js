#!/usr/bin/env bash

set -o errexit

git stash save 'Before Testing'
git clone https://github.com/reputage/didery.js.git
git checkout dev
