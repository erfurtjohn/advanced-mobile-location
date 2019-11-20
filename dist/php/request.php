<?php
require('./config.php');

if (isset($_POST['phone']) && ($_POST['phone'] != '')) {
    $number = $_POST['phone'];
    $number = str_replace(' ', '', $number);
    $error = "";

    try {
        $ch = curl_init();

        // Check if initialization gone wrong    
        if ($ch === false) {
            throw new Exception('failed to initialize');
        }

        curl_setopt($ch, CURLOPT_URL, $curl_url . $number);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSLCERT, $curl_sslcert);
        curl_setopt($ch, CURLOPT_SSLCERTPASSWD, $curl_sslcertpasswd);
        curl_setopt($ch, CURLOPT_USERAGENT, $curl_user_agent);
        curl_setopt($ch, CURLOPT_USERPWD, $curl_userpwd);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "accept: application/json",
            "cache-control:no-cache",
            "content-type:application/x-www-form-urlencoded"
        ));

        $response = curl_exec($ch);

        // Check the return value of curl_exec()
        if ($response === false) {
            $error = curl_error($ch);
        }

        // Close curl handle
        curl_close($ch);
    } catch (Exception $e) {
        // throw exception
    }

    // check if result is valid
    if (!empty($response) && $response != '[{"status":"no aml data"}]') {
        echo json_encode($response);
    } else {
        echo json_encode(array("error" => $error));
    }
} else {
    echo json_encode(false);
}
