#!/bin/bash

#************************************************#
#                 update-mdl.sh                  #
#          written by pdxbmw (Github)            #
#               October 16, 2015                 #
#                                                #
#         Download and format source files       # 
#             for Material Design Lite           #
#************************************************#

# main variables
PACKAGE_NAME="zodiase:mdl"
MDL_GITHUB_URL="https://github.com/google/material-design-lite.git"
OUTPUT_SCSS_FILE_NAME="material.scss"
OUTPUT_JS_FILE_NAME="material.js"
SASS_FOLDER_NAME="sass"

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

# ---------------------------------------------- #
# bundle_scss ()                                 #
# Collects and formats SCSS into single file     #
# ---------------------------------------------- #
bundle_scss () {
    PACKAGE_SASS_FOLDER="$PACKAGE_ROOT/$SASS_FOLDER_NAME"

    # remove existing sass folder
    rm -rf $PACKAGE_SASS_FOLDER

    # create new SASS folder to download MDL source into
    mkdir $PACKAGE_SASS_FOLDER

    # move SCSS files into new sass folder
    find $MDL_SRC_FOLDER -name '*.scss' -exec mv {} $PACKAGE_SASS_FOLDER \;

    # remove uneeded folders
    rm $PACKAGE_SASS_FOLDER/template.scss
    rm $PACKAGE_SASS_FOLDER/styleguide.scss

    # change import paths to this directory
    find $PACKAGE_SASS_FOLDER -name "*.scss" -type f -exec sed -i "" "s/@import \".*\//@import \"/g" {} +

    # preface import paths with package name and folder path 
    find $PACKAGE_SASS_FOLDER -name "*.scss" -type f -exec sed -i "" "s/@import \"/@import \"{$PACKAGE_NAME}\/$SASS_FOLDER_NAME\//g" {} +

    # add underscores so fourseven:scss won't process
    mv $PACKAGE_SASS_FOLDER/material-design-lite-grid.scss $PACKAGE_SASS_FOLDER/_material-design-lite-grid.scss
    mv $PACKAGE_SASS_FOLDER/material-design-lite.scss $PACKAGE_SASS_FOLDER/_material-design-lite.scss

    # copy main import SCSS file to root of package
    cp -f $PACKAGE_SASS_FOLDER/_material-design-lite.scss $PACKAGE_ROOT/$OUTPUT_SCSS_FILE_NAME
}    


# ---------------------------------------------- #
# bundle_js ()                                   #
# Concatenates all JS into one file              #
# ---------------------------------------------- #
bundle_js () {
    TEMP_JS_FOLDER="$TEMP_FOLDER/js"

    IIFE_OPEN="(function() {"
    IIFE_CLOSE="})();"
    USE_STRICT="\'use strict\';"

    # make temporary folder
    mkdir $TEMP_JS_FOLDER

    # create temp file with .new extension so it 
    # doesn't get processed with the rest of the JS
    TEMP_FILE="$TEMP_JS_FOLDER/$OUTPUT_JS_FILE_NAME.new"

    # move JS to temp folder
    find $MDL_SRC_FOLDER -name '*.js' -exec mv {} $TEMP_JS_FOLDER \;

    # remove demo.js
    rm $TEMP_JS_FOLDER/demo.js

    # create new file, add IIFE opening and strict statement
    echo ";$IIFE_OPEN" > $TEMP_FILE
    echo "${USE_STRICT//\\}" >> $TEMP_FILE # remove escape char

    # add and don't further process mdlComponentHandler.js 
    cat $TEMP_JS_FOLDER/mdlComponentHandler.js >> $TEMP_FILE
    rm $TEMP_JS_FOLDER/mdlComponentHandler.js

    # remove IIFE wrapper and strict statement from each file
    find $TEMP_JS_FOLDER -name "*.js" -type f -exec sed -i "" "s/^$IIFE_OPEN//g" {} +
    find $TEMP_JS_FOLDER -name "*.js" -type f -exec sed -i "" "s/$IIFE_CLOSE//g" {} +
    find $TEMP_JS_FOLDER -name "*.js" -type f -exec sed -i "" "s/$USE_STRICT//" {} +

    # add rAF.js third-party script
    cat $TEMP_JS_FOLDER/rAF.js >> $TEMP_FILE
    rm $TEMP_JS_FOLDER/rAF.js

    # concatenate remaining JS files
    cat $TEMP_JS_FOLDER/*.js >> $TEMP_FILE

    # add closing IIFE statement
    echo $IIFE_CLOSE >> $TEMP_FILE

    # rename and move file to root of package
    mv $TEMP_FILE $PACKAGE_ROOT/$OUTPUT_JS_FILE_NAME

    # cleanup
    rm -rf $TEMP_JS_FOLDER
}

# get the script root directory
get_script_dir

# set primary folder names
PACKAGE_ROOT=${SCRIPT_DIR%/*}
TEMP_FOLDER="$PACKAGE_ROOT/temp"
MDL_SRC_FOLDER="$TEMP_FOLDER/src"

# clone MDL repository
git clone $MDL_GITHUB_URL $TEMP_FOLDER

# call main functions
bundle_scss
bundle_js

# cleanup
rm -rf $TEMP_FOLDER
