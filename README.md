# Snow Notes - Shared Backend Server

This is an upgraded version of Snow Notes with a Node.js backend server for sharing notes across different devices and browsers.

## Features

- **Shared Notes**: All public notes are visible to everyone across all browsers and devices
- **Private Notes**: Notes with code protection are only accessible via code entry
- **Real-time Sync**: Notes are stored in a central SQLite database
- **Owner Control**: Only note creators can delete their own notes
- **Replies**: Users can add replies to notes
- **Admin Mode**: Special admin panel for managing all notes

## Setup & Installation

### Prerequisites

- Node.js (v16 or later)
- npm (comes with Node.js)

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- **express**: Web server framework
- **cors**: Cross-Origin Resource Sharing support
- **better-sqlite3**: SQLite database driver

### Step 2: Start the Server

```bash
npm start
```

The server will start on `http://localhost:3001`

For development with auto-reload:
```bash
npm run dev
```

### Step 3: Open the Client

Open your browser to `http://localhost:3001` to access the Snow Notes app.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all public notes |
| GET | `/api/notes/:code` | Get a specific note by code |
| GET | `/api/notes/owner/:clientId` | Get notes owned by a client |
| GET | `/api/notes/admin/all` | Get all notes (admin) |
| POST | `/api/notes` | Create a new note |
| POST | `/api/notes/:code/replies` | Add a reply to a note |
| DELETE | `/api/notes/:code` | Delete a note |

## How It Works

### Client-Server Communication

1. **On Load**: Client fetches all public notes from `/api/notes`
2. **Create Note**: Client sends POST request to `/api/notes` with note data
3. **Add Reply**: Client sends POST to `/api/notes/:code/replies`
4. **Delete Note**: Client sends DELETE to `/api/notes/:code`

### Database Structure

#### Notes Table
```
- id: Primary key
- code: Unique 10-character code
- title: Optional note title
- text: Note content (required)
- public: 1 for public, 0 for private
- owner: Client ID of the creator
- image: Base64 encoded image (optional)
- created: Timestamp
- updated: Timestamp
```

#### Replies Table
```
- id: Primary key
- noteCode: Reference to parent note
- text: Reply content
- time: Timestamp
```

## Using the App

### Create a Note
1. Click the **+** button (bottom left)
2. Enter title (optional) and content
3. Choose **Public** (visible to all) or **Private** (code protected)
4. Add image (optional)
5. Click Save

### Access Public Notes
- Public notes appear as snowflakes that float down the screen
- Click any snowflake to view the note and replies
- Add replies in the modal

### Access Private Notes
- Use the code input at the top to access private notes
- Enter the 10-character code provided by the note creator

### View Your Notes
- Your created notes appear in the sidebar "My Notes"
- Click to open and manage your notes
- Only you can see/delete your notes in the sidebar

### Admin Mode
- Enter code `ADMINSNOW` to enter admin mode
- Admin mode shows all notes with a list view
- Can delete any note from admin panel
- Enter code `EXITADMIN` to exit admin mode

## File Structure

```
armnewweb/
├── index.html          # HTML structure
├── script.js           # Client-side JavaScript (updated for API)
├── styles.css          # Styling
├── server.js           # Node.js Express server
├── package.json        # Dependencies
├── notes.db            # SQLite database (auto-created)
└── images/             # Static images folder
```

## Troubleshooting

### "Cannot GET /api/notes"
- Make sure the server is running: `npm start`
- Check that the server is on port 3001

### CORS Errors
- The server includes CORS headers for cross-origin requests
- Ensure you're accessing from `http://localhost:3001` or configure CORS in `server.js`

### Database Errors
- Delete `notes.db` file and restart server to reset database
- Make sure you have write permissions in the directory

### Notes Not Syncing
- Check browser console for errors (F12)
- Ensure server is running and accessible

## Future Improvements

- User authentication system
- Database backup/restore
- Real-time WebSocket updates
- Cloud storage support
