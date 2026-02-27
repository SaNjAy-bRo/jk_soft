<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Location: thankyou.html');
  exit;
}

$to = 'info@jksoft.co.in';
$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$service = trim($_POST['service'] ?? '');
$message = trim($_POST['message'] ?? '');
$formType = trim($_POST['form_type'] ?? 'Website Form');

// 1. Build the email subject and body
$subject = "JK Soft Enquiry: " . ($formType ?: 'Website Form');
$body = "New enquiry received on " . date('Y-m-d H:i:s') . "\n\n";
$body .= "Form: " . ($formType ?: 'Website Form') . "\n";
$body .= "Name: " . $name . "\n";
$body .= "Phone: " . $phone . "\n";
if ($service !== '') {
  $body .= "Service: " . $service . "\n";
}
if ($message !== '') {
  $body .= "Message: " . $message . "\n";
}

// 2. Prepare headers
$headers = [];
$headers[] = 'From: JK Soft Website <no-reply@jksoft.co.in>';
$headers[] = 'Reply-To: ' . ($name ? $name . ' <' . $to . '>' : $to);
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

// 3. Send Email
@mail($to, $subject, $body, implode("\r\n", $headers));

header('Location: thankyou.html');
exit;
?>