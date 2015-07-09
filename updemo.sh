#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

cpath="$(pwd)"

echo -e "Updating projects under ${cpath}/demo.\n"

for path in ./demo/*; do
	[ -d "${path}" ] || continue # if not a directory, skip
	dirname="$(basename "${path}")"
	echo -e "Updating ${RED}${dirname}${NC}.\n"
	cd $path
	meteor update
	cd $cpath
	echo ""
done

echo -e "${GREEN}All projects updated.${NC}\n"
