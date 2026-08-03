<?php
// دریافت داده از Node.js
$data = json_decode($argv[1], true);
$password = $data['password'] ?? '';

// رمز از Environment Variable خونده میشه
$SECRET_PASS = getenv('BOMBER_PASSWORD') ?: '5879';

if ($password === $SECRET_PASS) {
    echo json_encode(['success' => true, 'message' => 'ورود موفق']);
} else {
    echo json_encode(['success' => false, 'message' => 'رمز اشتباه']);
}
?>
