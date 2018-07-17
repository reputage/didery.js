#!/usr/bin/env bash

set -o errexit

test() {
    git stash save 'Testing Backup'
    git clone https://github.com/reputage/didery.git
    cd didery
    git checkout dev
    cd ..
    pip3 install -e didery
    dideryd .consensys/didery/db &
    PID=$!
    npm test
    kill -9 $PID
    pip3 uninstall -y didery
    rm -rf .consensys
    rm -rf didery
    git stash pop
}

test