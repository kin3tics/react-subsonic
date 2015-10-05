This is a simple, yet elegant front-end to subsonic written in React.

Version History
0.3.0
    - Menu
        Three menu options (Library, Search, Options)
    - Search
        Put in keyword, view results by artist, album, and song
        Artist results link to the artist page
        Album results link to the album page
        Songs can either be played immediately solo, or added to the currently editing playlist
    - Options
        View / Update the saved server settings (Server URL, Username, and Password)
    - Misc
        Refactored and expanded the routing
0.2.0
    - Playlists
        Server-Backed Playlists CRUD
        Client-side changes to a Server-Backed playlist is not automatically saved
        Load and switch between multiple playlists
        "Now Playing" playlist cannot be saved, deleted, or removed
        Individual songs can be removed from playlists
        Playlist details are now shown (# of tracks and total running time)
    - Now Playing
        Updates tab title when song is played
        
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
 - Handle missing album art
 
Medium Priority
 - Album Details - Add single files to current playlist (via Drag'n'Drop)
 - Album details - Scale art better
 - Noitification when client/server-side playlist is out of sync
 - Favorites / Starred (view & update)
 - Client-side Playlist Randomizer
 - Server-side Random Songs
 - Use Get/Save Play Queue API endpoints
 
 
Low Priority
 - Enforce PropertyTypes everywhere
 - Better hover colors
 - CSS Color editor
 - Webkit/Chrome notifications
 - Make it mobile-friendly
 - MD5 hash & salt passwords
 - Playlist support duplicate entries
 - Updating settings resulting in errors need to not kick back to login?
 - Fix playlist height for Search and Options pages
 - Ability to switch between tag api and folder api
 - Add bookmarks
 - User Management
 - Chat messages
 - Sharing
 - Save "Now Playing" as a new playlist