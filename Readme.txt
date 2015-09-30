This is a simple, yet elegant front-end to subsonic written in React.

Version History
0.1.0
    - Login Screen
        Uses HTML5 localstorage to store the values (cannot be modified without clearing browser cache as of 0.1.0)
        Stores password as plaintext
    - All media library calls currently use tagging, not folder structure
    - Artist list
        Uses HTML5 sessionstorage to store the values (a new tab will clear this cache)
    - Artist Album list
        Uses an in-memory cache to store the values (a tab refresh will clear this cache)
    - Album details
        No cache
        Can click on an item to create a new "Now Playing" playlist starting at file
        Can append entire album to the "Now Playing" playlist
        Can append single items to the "Now Playing" playlist
    - In-Memory "Now Playing" Playlist
        Uses HTML5 sessionstorage to store the list and last known played item
        Playlist will play next song automatically
        Playlist can be reordered from drag & drop
        Does not support duplicate entries
    - Audio player
        Play/Pause (button & spacebar)
        Next Track (button)
        Prev Track (button)
        Does not support tracking to a point in item

TODOs

High Priority
 - Playlist Manager
 - Design custom HTML5 audio player (audio tracking)

Medium Priority
 - Album Details - Add single files to current playlist (via Drag'n'Drop)
 - Album details - Scale art better
 - Server configuration management
 - Search Albums, Artists, and Songs
 - Handle missing album art
 
Low Priority
 - Enforce PropertyTypes everywhere
 - Better hover colors
 - CSS Color editor
 - Webkit/Chrome notifications
 - Make it mobile-friendly
 - Restructure routing
 - MD5 hash & salt passwords
 - Playlist support duplicate entries