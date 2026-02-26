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

$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$safeService = htmlspecialchars($service, ENT_QUOTES, 'UTF-8');
$safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

$subject = "JK Soft Enquiry: " . ($formType ?: 'Website Form');
$body = "New enquiry received.\n\n";
$body .= "Form: " . ($formType ?: 'Website Form') . "\n";
$body .= "Name: " . $safeName . "\n";
$body .= "Phone: " . $safePhone . "\n";
if ($safeService !== '') {
  $body .= "Service: " . $safeService . "\n";
}
if ($safeMessage !== '') {
  $body .= "Message: " . $safeMessage . "\n";
}

$headers = [];
$headers[] = 'From: JK Soft Website <no-reply@jksoft.co.in>';
$headers[] = 'Reply-To: ' . ($safeName ? $safeName . ' <info@jksoft.co.in>' : 'info@jksoft.co.in');
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

@mail($to, $subject, $body, implode("\r\n", $headers));

header('Location: thankyou.html');
exit;
?>
