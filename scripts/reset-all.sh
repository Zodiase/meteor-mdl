#!/bin/bash

################################################################################
# This script resets all integration tests.
################################################################################

SCRIPTDIR="$(dirname "$0")"
ROOTDIR="${SCRIPTDIR}/../"

cd $ROOTDIR
CWD=$(pwd)

for D in `find -H integration-tests -type d -d -maxdepth 1 -mindepth 1`
do

printf "Resetting %s...\n" "$D"
cd $CWD/$D
meteor reset

done
