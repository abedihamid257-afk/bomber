const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_PASS = process.env.BOMBER_PASSWORD || '5879';

app.use(express.static('public'));
app.use(express.json());

app.get('/api/get-secret', (req, res) => {
    res.json({ secret: SECRET_PASS });
});

app.post('/api/check-pass', (req, res) => {
    const { password } = req.body;
    if (password === SECRET_PASS) {
        res.json({ success: true });
    } else {
        res.status(403).json({ success: false });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log('Server running on port ' + PORT));
