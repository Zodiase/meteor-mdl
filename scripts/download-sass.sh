#!/bin/bash

#************************************************#
#               download-sass.sh                 #
#          written by pdxbmw (Github)            #
#               October 16, 2015                 #
#                                                #
#        Download and extract SASS files         # 
#            for Material Design Lite            #
#************************************************#

# package variables
PACKAGE_NAME="zodiase:mdl"
SASS_FOLDER_NAME="sass"
MAIN_FILE_NAME="material.scss"

# MDL variables
MDL_FOLDER_NAME="material-design-lite"
MDL_GITHUB_URL="https://github.com/google/material-design-lite.git"

# ---------------------------------------------- #
# get_script_dir()                               #
# Sets SCRIPT_DIR to path of script directory    #
# Source: http://stackoverflow.com/a/246128      #
# ---------------------------------------------- #
get_script_dir () {
    SOURCE="${BASH_SOURCE[0]}"
    while [ -h "$SOURCE" ]; do
        SCRIPT_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
        SOURCE="$(readlink "$SOURCE")"
        [[ $SOURCE != /* ]] && SOURCE="$SCRIPT_DIR/$SOURCE"
    done
    SCRIPT_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
}

# call script
get_script_dir

# set primary folder names
PACKAGE_ROOT=${SCRIPT_DIR%/*}
PACKAGE_SASS_FOLDER="$PACKAGE_ROOT/$SASS_FOLDER_NAME"
MDL_FOLDER="$PACKAGE_SASS_FOLDER/$MDL_FOLDER_NAME"
MDL_SRC_FOLDER="$MDL_FOLDER/src"
    
# remove existing sass folder
rm -rf $PACKAGE_SASS_FOLDER

# create new SASS folder to download MDL source into
mkdir $PACKAGE_SASS_FOLDER

# clone MDL repository
git clone $MDL_GITHUB_URL $MDL_FOLDER

# delete non-SCSS files
find $MDL_SRC_FOLDER -type f -not -name "*.scss" | xargs rm

# move SCSS files into root of src folder
mv $MDL_SRC_FOLDER/*/*.scss $MDL_SRC_FOLDER

# delete subfolders
rm -rf $MDL_SRC_FOLDER/*/

# remove uneeded folders
rm $MDL_SRC_FOLDER/template.scss
rm $MDL_SRC_FOLDER/styleguide.scss

# change import paths import paths to this directory
find $MDL_SRC_FOLDER -name "*.scss" -type f -exec sed -i "" "s/@import \".*\//@import \"/g" {} +

# add package 
find $MDL_SRC_FOLDER -name "*.scss" -type f -exec sed -i "" "s/@import \"/@import \"{$PACKAGE_NAME}\/$SASS_FOLDER_NAME\//g" {} +

# add underscores so fourseven:scss won't process
mv $MDL_SRC_FOLDER/material-design-lite-grid.scss $MDL_SRC_FOLDER/_material-design-lite-grid.scss
mv $MDL_SRC_FOLDER/material-design-lite.scss $MDL_SRC_FOLDER/_material-design-lite.scss

# move SCSS files to new sass folder
mv $MDL_SRC_FOLDER/*.scss $PACKAGE_SASS_FOLDER

# hide evidence
rm -rf $MDL_FOLDER

# copy main import SCSS file to root of package
cp -f $PACKAGE_SASS_FOLDER/_material-design-lite.scss $PACKAGE_ROOT/$MAIN_FILE_NAME
