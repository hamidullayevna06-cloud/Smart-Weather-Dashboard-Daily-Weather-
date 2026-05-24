<?php
header('Access-Control-Allow-Origin: *'); 
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "", "weather_db");

if ($mysqli->connect_errno) {
    echo "Baza bilan ulanib bo'lmadi: " . $mysqli->connect_error;
    exit();
}

$city = isset($_GET['city']) ? $_GET['city'] : 'Tashkent';

$sql = "SELECT * FROM weather
        WHERE city = '{$city}' 
        AND weather_when >= DATE_SUB(NOW(), INTERVAL 10 SECOND) 
        ORDER BY weather_when DESC LIMIT 1";

$result = $mysqli->query($sql);

if ($result->num_rows == 0) {
    include('data-import.php'); 
    
    $sql = "SELECT * FROM weather WHERE city = '{$city}' ORDER BY weather_when DESC LIMIT 1";
    $result = $mysqli->query($sql);
}

$row = $result->fetch_assoc();
print json_encode($row);

$result->free_result();
$mysqli->close();
?>