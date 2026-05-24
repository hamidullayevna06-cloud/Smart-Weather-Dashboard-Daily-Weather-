<?php
$apiKey = "1e3e8f230b6064d27976e41163a82b77"; 

$city = $_GET['city']; 

$url = "https://api.openweathermap.org/data/2.5/weather?q={$city}&appid={$apiKey}&units=metric";
$data = file_get_contents($url);
$json = json_decode($data, true);

$weather_description = $json['weather'][0]['description'];
$weather_temperature = $json['main']['temp'];
$humidity = $json['main']['humidity'];
$weather_when = date("Y-m-d H:i:s"); 

$sql_insert = "INSERT INTO weather (weather_description, weather_temperature, humidity, weather_when, city) 
               VALUES('{$weather_description}', {$weather_temperature}, {$humidity}, '{$weather_when}', '{$city}')";

if (!$mysqli->query($sql_insert)) {
    echo("SQL Xatolik: " . $mysqli->error);
}
?>