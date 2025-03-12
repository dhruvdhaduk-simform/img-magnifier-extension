#!/bin/bash

# This scripts downloads deployed extension, extracts it and loads it in Chrome.

log() {
    # echo -e "\e[32m [LOG]:\e[0m $@"
    echo " -- [LOG]: $@"
}

# Check if the link is provided.
if [ $# -eq 0 ]; then
    log "Please provide the zip file link as command line argument"
    exit 1
fi

# Initialize some directories to store the extension.
EXT_DIR="$HOME/img-magnifier-chrome-extension"
ZIP_URL=$1
ZIP_FILE="$EXT_DIR/compressed.zip"
EXTRACTED_DIR="$EXT_DIR/extracted"

# Remove the old files.
log "Removing directory - $EXT_DIR"
rm -rf "$EXT_DIR"

# Create the directory to put all files
mkdir -p "$EXT_DIR"

# Download the Extension ZIP file.
log "Downloading extension zip file from $ZIP_URL" 
curl -o "$ZIP_FILE" "$ZIP_URL"
log "Extension ZIP file downloaded at $ZIP_FILE"

# Extract the ZIP file.
log "Extracting ZIP file - $ZIP_FILE"
unzip -q "$ZIP_FILE" -d "$EXTRACTED_DIR"
log "ZIP file extracted at - $EXTRACTED_DIR"


# Detect the Operating System
OS=$(uname)

# Find the Chrome Executable
if [[ "$OS" == "Linux" ]]; then
    log "OS detected - Linux"
    if command -v "google-chrome" > /dev/null; then
        CHROME_EXE="google-chrome"
    elif command -v "google-chrome-stable" > /dev/null; then
        CHROME_EXE="google-chrome-stable"
    elif command -v "chromium" > /dev/null; then
        CHROME_EXE="chromium"
    elif command -v "chromium-browser" > /dev/null; then
        CHROME_EXE="chromium-browser"
    else
        log "hrome is not installed. Or could not found."
        exit 1
    fi
elif [[ "$OS" == "Darwin" ]]; then
    log "OS detected - MacOS"

    CHROME_EXE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    if [[ ! -f "$CHROME_EXE" ]]; then
        log "Coundn't found Chrome executable."
        exit 1
    fi
else
    log "This OS is not supported. Install the extension manually."
    exit 1
fi

# Load the Extension in Chrome.
log "Launching Chrome . . ."
"$CHROME_EXE" --load-extension="$EXTRACTED_DIR"