const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// اجرای PHP
function runPHP(script, data) {
    return new Promise((resolve) => {
        const jsonData = JSON.stringify(data);
        exec(`php ${script} '${jsonData.replace(/'/g, "\\'")}'`, (error, stdout, stderr) => {
            if (error) {
                resolve({ success: false, error: stderr || error.message });
            } else {
                try {
                    resolve(JSON.parse(stdout));
                } catch(e) {
                    resolve({ success: false, error: stdout });
                }
            }
        });
    });
}

// API: چک کردن رمز
app.post('/api/check-pass', async (req, res) => {
    const result = await runPHP('api/check-pass.php', {
        password: req.body.password || ''
    });
    res.json(result);
});

// API: ارسال پیامک
app.post('/api/send-sms', async (req, res) => {
    const result = await runPHP('api/send-sms.php', {
        phone: req.body.phone || '',
        mode: req.body.mode || 10
    });
    res.json(result);
});

// همه مسیرها → index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
