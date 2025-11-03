const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 8080;

// ✅ MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'testdb-1.cnso6k62wnhp.ap-south-1.rds.amazonaws.com',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASS || '12345678',
  database: process.env.DB_NAME || 'myapp_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    return;
  }
  console.log('✅ MySQL Connected...');
});

// ✅ Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Create table
app.get('/createTable', (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255)
    )
  `;
  db.query(sql, (err) => {
    if (err) return res.status(500).send(err.sqlMessage);
    res.send('✅ Table "items" created (or already exists)');
  });
});

// ✅ Add item
app.post('/addItem', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send('❌ Missing data');
  db.query('INSERT INTO items SET ?', { name }, (err) => {
    if (err) return res.status(500).send(err.sqlMessage);
    res.send('✅ Item added successfully');
  });
});

// ✅ Get all items
app.get('/getItems', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) return res.status(500).send(err.sqlMessage);
    res.json(results);
  });
});

// ✅ Update an item
app.put('/updateItem/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !id) {
    return res.status(400).send('❌ Missing ID or name');
  }

  const sql = 'UPDATE items SET name = ? WHERE id = ?';
  db.query(sql, [name, id], (err, result) => {
    if (err) return res.status(500).send(err.sqlMessage);
    if (result.affectedRows === 0) return res.send('⚠️ No item found with that ID');
    res.send('✅ Item updated successfully');
  });
});

// ✅ Delete an item
app.delete('/deleteItem/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send('❌ Missing ID');
  }

  const sql = 'DELETE FROM items WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err.sqlMessage);
    if (result.affectedRows === 0) return res.send('⚠️ No item found with that ID');
    res.send('✅ Item deleted successfully');
  });
});

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});
