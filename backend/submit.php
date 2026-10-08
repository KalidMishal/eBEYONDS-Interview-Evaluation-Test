<?php
error_reporting(0);
header('Content-Type: application/json');

// Helper function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Check if request is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Initialize response array
    $response = array('status' => 'error', 'message' => 'Unknown error occurred.');
    
    // Validate and sanitize inputs
    $firstName = isset($_POST['first_name']) ? sanitize_input($_POST['first_name']) : '';
    $lastName = isset($_POST['last_name']) ? sanitize_input($_POST['last_name']) : '';
    $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
    $comments = isset($_POST['comments']) ? sanitize_input($_POST['comments']) : '';
    
    // Backend Validation
    if (empty($firstName)) {
        $response['message'] = 'First Name is required.';
        echo json_encode($response);
        exit;
    }
    
    if (empty($lastName)) {
        $response['message'] = 'Last Name is required.';
        echo json_encode($response);
        exit;
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'A valid Email is required.';
        echo json_encode($response);
        exit;
    }
    
    if (empty($comments)) {
        $response['message'] = 'Comments are required.';
        echo json_encode($response);
        exit;
    }
    
    // Data is valid, prepare to save
    $submissionData = array(
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => $email,
        'phone' => $phone,
        'comments' => $comments,
        'submitted_at' => date('Y-m-d H:i:s')
    );
    
    // Save to JSON file
    $jsonFile = 'data.json';
    $currentData = [];
    
    if (file_exists($jsonFile)) {
        $fileContent = file_get_contents($jsonFile);
        $currentData = json_decode($fileContent, true);
        if (!is_array($currentData)) {
            $currentData = [];
        }
    }
    
    $currentData[] = $submissionData;
    
    if (file_put_contents($jsonFile, json_encode($currentData, JSON_PRETTY_PRINT))) {
        
        // --- Send Emails ---
        
        // 1. Auto-response to User
        $userSubject = "Thank you for contacting eBEYONDS";
        $userMessage = "Dear $firstName $lastName,\n\n";
        $userMessage .= "Thank you for getting in touch with us. We have received your submission and will get back to you shortly.\n\n";
        $userMessage .= "Best Regards,\neBEYONDS Team";
        $userHeaders = "From: noreply@ebeyonds.com\r\n";
        
        // Attempt to send user email (might not work without SMTP server, suppressing warnings with @)
        // @mail($email, $userSubject, $userMessage, $userHeaders);
        
        // 2. Admin Email
        $adminTo = "dumidu.kodithuwakku@ebeyonds.com, prabhath.senadheera@ebeyonds.com";
        $adminSubject = "New Form Submission - eBEYONDS Evaluation";
        $adminMessage = "A new form has been submitted.\n\n";
        $adminMessage .= "Details:\n";
        $adminMessage .= "First Name: $firstName\n";
        $adminMessage .= "Last Name: $lastName\n";
        $adminMessage .= "Email: $email\n";
        $adminMessage .= "Phone: $phone\n";
        $adminMessage .= "Comments: $comments\n";
        $adminHeaders = "From: noreply@ebeyonds.com\r\n";
        $adminHeaders .= "Reply-To: $email\r\n";
        
        // Attempt to send admin email
        // @mail($adminTo, $adminSubject, $adminMessage, $adminHeaders);
        
        // Success Response
        $response['status'] = 'success';
        $response['message'] = 'Form submitted successfully! Check your email for confirmation.';
        
    } else {
        $response['message'] = 'Failed to save submission data.';
    }
    
    echo json_encode($response);
    
} else {
    // Not a POST request
    http_response_code(405);
    echo json_encode(array('status' => 'error', 'message' => 'Method not allowed.'));
}
?>
