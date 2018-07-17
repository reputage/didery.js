#!/usr/bin/env bash

set -o errexit

before() {
    git stash save 'Before Testing'
    git clone https://github.com/reputage/didery.git
    cd didery
    git checkout dev
    cd ..
    pip3 install -e didery
    dideryd -p 8080 .consensys/didery/db
}

test() {
    npm tests
}

after() {
    kill -INT 888
    pip3 uninstall didery
    rm -rf .consensys
    rm -rf didery
    git stash pop
}

before
test
after