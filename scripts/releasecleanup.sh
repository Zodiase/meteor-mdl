#!/bin/bash

cd "$(dirname "$0")"
cd ../

# Make sure we're in `master`.
git checkout master

# Delete existing `release` branch.
git branch -D release

# Create new `release` branch (with local changes).
git checkout -b release

# Remove unnecessary files.
rm -f ForEachUpdate.md package.json
rm -rf integration-tests node_modules scripts

# Commit changes.
git commit -am  "Release cleanup."

# Force push to origin (overwriting existing remote branch).
git push -f origin release
