import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.static(__dirname));

// Database setup
const db = new Database(path.join(__dirname, 'notes.db'));

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    title TEXT,
    text TEXT NOT NULL,
    public INTEGER DEFAULT 1,
    owner TEXT NOT NULL,
    image TEXT,
    created INTEGER NOT NULL,
    updated INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    noteCode TEXT NOT NULL,
    text TEXT NOT NULL,
    time INTEGER NOT NULL,
    FOREIGN KEY(noteCode) REFERENCES notes(code) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_notes_public ON notes(public);
  CREATE INDEX IF NOT EXISTS idx_replies_noteCode ON replies(noteCode);
`);

// Prepared statements
const insertNote = db.prepare(`
  INSERT INTO notes (code, title, text, public, owner, image, created, updated)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const getNote = db.prepare(`
  SELECT * FROM notes WHERE code = ?
`);

const getAllNotes = db.prepare(`
  SELECT * FROM notes WHERE public = 1 ORDER BY created DESC
`);

const getNotesByOwner = db.prepare(`
  SELECT * FROM notes WHERE owner = ? ORDER BY created DESC
`);

const deleteNote = db.prepare(`
  DELETE FROM notes WHERE code = ?
`);

const insertReply = db.prepare(`
  INSERT INTO replies (noteCode, text, time) VALUES (?, ?, ?)
`);

const getReplies = db.prepare(`
  SELECT text, time FROM replies WHERE noteCode = ? ORDER BY time ASC
`);

const deleteRepliesByCode = db.prepare(`
  DELETE FROM replies WHERE noteCode = ?
`);

// API Routes

// Get all notes (admin endpoint)
app.get('/api/notes/admin/all', (req, res) => {
	try {
		const notes = db.prepare('SELECT * FROM notes ORDER BY created DESC').all().map(note => ({
			...note,
			public: !!note.public,
			replies: getReplies.all(note.code)
		}));
		res.json(notes);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get all public notes
app.get('/api/notes', (req, res) => {
  try {
    const notes = getAllNotes.all().map(note => ({
      ...note,
      public: !!note.public,
      replies: getReplies.all(note.code)
    }));
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get note by code (public or with code verification)
app.get('/api/notes/:code', (req, res) => {
  try {
    const note = getNote.get(req.params.code);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    const replies = getReplies.all(note.code);
    res.json({
      ...note,
      public: !!note.public,
      replies
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notes by owner (client)
app.get('/api/notes/owner/:clientId', (req, res) => {
  try {
    const notes = getNotesByOwner.all(req.params.clientId).map(note => ({
      ...note,
      public: !!note.public,
      replies: getReplies.all(note.code)
    }));
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new note
app.post('/api/notes', (req, res) => {
  try {
    const { code, title, text, public: isPublic, owner, image } = req.body;

    if (!code || !text || !owner) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const now = Date.now();
    insertNote.run(code, title || '', text, isPublic ? 1 : 0, owner, image || null, now, now);

    res.json({ success: true, code });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Code already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Add reply to note
app.post('/api/notes/:code/replies', (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Reply text required' });
    }

    const note = getNote.get(req.params.code);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const now = Date.now();
    insertReply.run(req.params.code, text, now);

    res.json({ success: true, time: now });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete note (owner verification on client side)
app.delete('/api/notes/:code', (req, res) => {
  try {
    const note = getNote.get(req.params.code);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Note: In production, would verify ownership via session/token
    deleteRepliesByCode.run(req.params.code);
    deleteNote.run(req.params.code);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Snow Notes Server running on http://localhost:${PORT}`);
  console.log(`\nAPI Endpoints:\n  GET  /api/notes\n  GET  /api/notes/:code\n  GET  /api/notes/owner/:clientId\n  POST /api/notes\n  POST /api/notes/:code/replies\n  DELETE /api/notes/:code`);
});
