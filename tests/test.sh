#!/usr/bin/env bash

set -o errexit

test() {
    git clone https://github.com/reputage/didery.git
    cd didery
    #git checkout dev
    cd ..
    pip3 install -e didery
    dideryd --path .consensys/didery/db8080 &
    PID=$!
    npm run mocha
    kill -9 $PID
    pip3 uninstall -y didery
    rm -rf .consensys
    rm -rf didery
}

test