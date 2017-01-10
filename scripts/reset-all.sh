#!/bin/bash

################################################################################
# This script resets all integration tests.
################################################################################

SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOTDIR="${SCRIPTDIR}/../"

cd $ROOTDIR
CWD=$(pwd)

for D in `find -H integration-tests -type d -d -maxdepth 1 -mindepth 1`
do

printf "Resetting %s...\n" "$D"
cd $CWD/$D
meteor reset

done
