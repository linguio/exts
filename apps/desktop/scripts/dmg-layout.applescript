on run arguments
    set mountPath to item 1 of arguments
    set diskFolder to POSIX file mountPath as alias
    with timeout of 20 seconds
        tell application "Finder"
            open diskFolder
            set installWindow to container window of diskFolder
            set current view of installWindow to icon view
            set toolbar visible of installWindow to false
            set statusbar visible of installWindow to false
            set bounds of installWindow to {120, 120, 760, 520}
            set options to icon view options of installWindow
            set arrangement of options to not arranged
            set icon size of options to 88
            set text size of options to 14
            set label position of options to bottom
            set background picture of options to POSIX file (mountPath & "/.background/installer.png")
            set position of item "exts.app" of diskFolder to {170, 200}
            set position of item "应用程序" of diskFolder to {470, 200}
            update diskFolder without registering applications
            delay 2
            close installWindow
        end tell
    end timeout
end run
