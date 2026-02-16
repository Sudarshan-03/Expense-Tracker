const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Expense Tracker API is running');
});

// POST /expenses
app.post('/expenses', (req, res) => {
    const idempotencyKey = req.headers['idempotency-key'];
    const { amount, category, description, date } = req.body;

    if (!idempotencyKey) {
        return res.status(400).json({ error: 'Idempotency-Key header is required' });
    }

    // 1. Check idempotency log
    db.get('SELECT status_code, response_body FROM idempotency_log WHERE key = ?', [idempotencyKey], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (row) {
            // Idempotent hit: return saved response
            try {
                return res.status(row.status_code).json(JSON.parse(row.response_body));
            } catch (parseError) {
                console.error('Error parsing stored response body:', parseError);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }

        // 2. Validate inputs
        if (!amount || !Number.isInteger(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive integer (in cents)' });
        }
        if (!category || !description || !date) {
            return res.status(400).json({ error: 'Category, description, and date are required' });
        }

        // 3. Insert new expense
        const id = uuidv4();
        const created_at = new Date().toISOString();
        const expense = { id, amount, category, description, date, created_at };

        // We need to perform a transaction-like operation. 
        // Since node-sqlite3 doesn't support easy transactions without wrapping, 
        // we'll serialize the operations.
        db.serialize(() => {
            const stmt = db.prepare('INSERT INTO expenses (id, amount, category, description, date, created_at) VALUES (?, ?, ?, ?, ?, ?)');

            stmt.run(id, amount, category, description, date, created_at, function (err) {
                if (err) {
                    console.error('Error inserting expense:', err);
                    return res.status(500).json({ error: 'Failed to create expense' });
                }

                // 4. Log idempotency
                const responseBody = JSON.stringify(expense);
                const statusCode = 201;

                const logStmt = db.prepare('INSERT INTO idempotency_log (key, response_body, status_code) VALUES (?, ?, ?)');
                logStmt.run(idempotencyKey, responseBody, statusCode, function (logErr) {
                    if (logErr) {
                        console.error('Error logging idempotency:', logErr);
                        // In a real system, we might want to rollback the expense insertion here.
                        // For this assignment, we proceed but log the error.
                    }
                    res.status(statusCode).json(expense);
                });
                logStmt.finalize();
            });
            stmt.finalize();
        });
    });
});

// GET /expenses
app.get('/expenses', (req, res) => {
    const { category, sort } = req.query;
    let sql = 'SELECT * FROM expenses';
    const params = [];

    if (category) {
        sql += ' WHERE category = ?';
        params.push(category);
    }

    if (sort === 'date_desc') {
        sql += ' ORDER BY date DESC';
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error fetching expenses:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
