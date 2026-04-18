const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to execute arbitrary SQL (for the Terminal UI)
app.post('/api/query', (req, res) => {
    const { query } = req.body;
    
    if (!query) {
        return res.status(400).json({ error: "Query is empty." });
    }

    const lowerQuery = query.trim().toLowerCase();

    // Determine query type to use correct SQLite function
    if (lowerQuery.startsWith('select') || lowerQuery.startsWith('pragma')) {
        db.all(query, [], (err, rows) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ results: rows });
        });
    } else {
        db.run(query, [], function(err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            // For insert, update, delete
            res.json({ 
                message: "Query executed successfully.",
                changes: this.changes,
                lastID: this.lastID
            });
        });
    }
});

// Standard CRUD endpoints for DONOR as an example
app.get('/api/donors', (req, res) => {
    db.all("SELECT * FROM DONOR", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/donors', (req, res) => {
    const { first_name, last_name, dob, gender, blood_group, phone, email, address, registration_date } = req.body;
    const sql = `INSERT INTO DONOR (first_name, last_name, dob, gender, blood_group, phone, email, address, registration_date) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [first_name, last_name, dob, gender, blood_group, phone, email, address, registration_date];
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.json({ message: "Donor added successfully", id: this.lastID });
        }
    });
});

// Default fallback to index.html for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
