#!/bin/bash
PROJECT_NAME="OSK FixDefect"
SCHEME_NAME="OSK FixDefect"
STARTTIME=$(date +%s);

cd platforms/ios

### Cleaning Xcode
echo "--- Cleaning Xcode [Time Elapsed $(($(date +%s) - $STARTTIME))s]"

/usr/bin/xcodebuild clean      \
    -project "$PROJECT_NAME".xcodeproj  \
    -configuration Release     \
    -alltargets

### Archiving
echo "--- Archiving [Time Elapsed $(($(date +%s) - $STARTTIME))s]"

/usr/bin/xcodebuild archive           \
    -project "$PROJECT_NAME".xcodeproj  \
    -scheme "$SCHEME_NAME"              \
    -archivePath "$PROJECT_NAME"
