#!/bin/bash

SCRIPTDIR="$(dirname "$0")"
ROOTDIR="${SCRIPTDIR}/../"
TESTDIR="${ROOTDIR}/integration-tests"

cd $TESTDIR

for D in `find -H . -type d -d -maxdepth 1 -mindepth 1`
do
cd $D

meteor update --release 1.2.1
meteor --test --release velocity:METEOR@1.2.1_2

cd ../
done
