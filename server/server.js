const express = require('express');
const db = require('./db');
const app = express();

db.connect();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('client'));

const port = process.env.PORT || 3000;

app.get('/api', (req, res) => {
    const { query } = req.query;
    db.query(query, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.status(404).json({ msg: 'cannot perform query' });
            return;
        }
        console.log(results);
        res.json(results);
    });
});

// console.log('query');
// db.query('SELECT * FROM employees', (err, results, fields) => {
//     console.log(results);
// });

app.listen(port, () => {
    console.log(`app is listening on http://localhost:${port}`);
});
