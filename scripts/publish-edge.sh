#!/bin/bash

################################################################################
# This script publishes the edge version.
################################################################################

RLSVER=1.3.5.1
EDGE_VERSION=1.3.0

SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOTDIR="${SCRIPTDIR}/../"

cd $ROOTDIR/meteor-package

# Install npm dependencies
npm install

# Export the edge version so the package will use a different name.
export EDGE_VERSION
# Publish meteor package under the specified release.
meteor publish --release $RLSVER

# Hide the package.
meteor admin set-unmigrated zodiase:mdl-edge
