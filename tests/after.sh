#!/usr/bin/env bash

set -o errexit

kill -INT 888
rm -rf .consensys
rm -rf didery
git stash pop