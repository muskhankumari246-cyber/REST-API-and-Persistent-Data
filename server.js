import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Database Connection
const db = new sqlite3.Database('./internships.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite persistent database.');
    }
});

// GET API Endpoint
app.get('/api/internships', (req, res) => {
    db.all(`SELECT * FROM internships`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({
            success: true,
            page: 1,
            limit: 10,
            count: rows.length,
            data: rows
        });
    });
});

// POST API Endpoint to Store New Internship
app.post('/api/internships', (req, res) => {
    const { title, company, domain, location, stipend } = req.body;
    const query = `INSERT INTO internships (title, company, domain, location, stipend) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(query, [title, company, domain, location, stipend], function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, id: this.lastID });
    });
});

// Root Route for Frontend UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running smoothly on http://localhost:${PORT}`);
});