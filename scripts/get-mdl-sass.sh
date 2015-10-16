#!/bin/bash

FOLDER='material-design-lite'
GITHUB_URL='https://github.com/google/material-design-lite.git'

rm -rf ../sass

mkdir ../sass
cd ../sass

git clone $GITHUB_URL

cd $FOLDER/src

# delete non-scss files
find . -type f -not -name '*.scss' | xargs rm

# move scss files into root of src folder
mv */*.scss .

# delete folders
rm -r */

# remove uneeded folders
rm template.scss
rm styleguide.scss

# change import paths to this directory
find . -name '*.scss' -type f -exec sed -i '' 's/@import \".*\//@import \"/g' {} +
find . -name '*.scss' -type f -exec sed -i '' 's/@import \"/@import \"{zodiase:mdl}\/sass\//g' {} +

# add underscores so sass won't process
mv material-design-lite-grid.scss _material-design-lite-grid.scss
mv material-design-lite.scss _material-design-lite.scss

# move sass files to root of sass folder
cd ../..
mv $FOLDER/src/*.scss .

# remove evidence
rm -rf $FOLDER

# copy main import sass file to root of package
cp -f _material-design-lite.scss ../material.scss