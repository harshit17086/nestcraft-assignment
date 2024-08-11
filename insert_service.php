
<?php
$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "salon_services";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$service_name = $_POST['service_name'];
$regular_amount = $_POST['regular_amount'];
$basic_amount = $_POST['basic_amount'];
$advance_amount = $_POST['advance_amount'];
$duration = $_POST['duration'];
$gender = $_POST['gender'];


$stmt = $conn->prepare("INSERT INTO services (service_name, regular_amount, basic_amount, advance_amount, duration, gender) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("siiiss", $service_name, $regular_amount, $basic_amount, $advance_amount, $duration, $gender);


if ($stmt->execute()) {
    echo "New record created successfully";
} else {
    die("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
}


$stmt->close();
$conn->close();
?>
