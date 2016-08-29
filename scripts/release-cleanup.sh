#!/bin/bash

################################################################################
# This script cleans up the repo and creates a new branch for releasing.
################################################################################

SRCBRANCH="master"
RLSBRANCH="release"

SCRIPTDIR="$(dirname "$0")"
ROOTDIR="${SCRIPTDIR}/../"

cd $ROOTDIR

# Make sure we're in source branch.
git checkout $SRCBRANCH

# Delete existing release branch.
git branch -D $RLSBRANCH

# Create new release branch (with local changes).
git checkout -b $RLSBRANCH

# Clean-up not tracked files.
git clean -fdx

# Remove unnecessary files.
rm -f Developer.md
rm -rf integration-tests meteor-package/node_modules scripts

# Commit changes.
git commit -am  "Release cleanup."

# Force push to origin (overwriting existing remote branch).
git push -f origin $RLSBRANCH