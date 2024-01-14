<?php

$conn = mysqli_connect('localhost','root','','travel') or die('connection failed');

// Vérifie si le formulaire a été soumis
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Récupère les données du formulaire
    $email = $_POST['email'] ?? '';
    $passwordd = $_POST['password'] ?? '';


    // Prépare la requête de sélection
    $sql = "SELECT * FROM client WHERE email='$email' AND password='$passwordd'";

    // Exécute la requête
    $result = $conn->query($sql);

    // Vérifie si un utilisateur correspond aux informations de connexion
    if ($result->num_rows > 0) {
        header('Location: home.php');
        exit;}
    else {
        echo "Identifiants de connexion incorrects";
    }

}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-QJw0ET2D+e4I4Kt1F+0x22JtP9ViTCK+St57Ojj/HwRwOQU1siF1+vvv2KvlIbOx+TJq3I76ZxxaJdKmRcRz1g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <title>Login</title>
    <style>
        body{
            background-image: 
            url(image.jpg);
            background-repeat: no-repeat;
            background-size: cover;
        }
        .global{
            background-color: black;
            margin:100px;
            width: 450px;
            height: 500px;
            border: solid #26c4ec 1 px;
            border-bottom-left-radius: 150px;
            border-top-right-radius: 150px;
            box-shadow: 0 0 10px blue;
        }
        h1{
            text-align: center;
            font-size: 80px;
            font-family: ' monospace';
            color:#1034A6;
        }
        .input1{
            width: 70%;
            height: 50px;
            border-radius: 25px;
            border: none;
            outline: none;
            margin-left: 30px;
            margin-right: 30px;
            background-color: #26c4ec;
            padding-left: 20px;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            color: white;
        }
        .input2{
            background-color: #1034A6;
            border: none;
            width: 40%;
            height: 50px;
            border-radius: 25px;
            font-size: 20px;
            margin-top: 20px;
            margin-bottom: 20px;
            margin-left: 30%;
            margin-right: 30%;
            color: white;
        }
        .input2:hover{
            background-color: #26c4ec;
        }
        .fa{
            margin-left: 40px;
            margin-top: 15px;
            color: white;
        }
        form{
            margin-top: 50px;
            margin-left: 50px;
            margin-right: 50px;
        }
        p{
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="global">
        <h1>Login</h1>
        <form method="POST">
            <p>
                <i class="fa fa-envelope fa-2x"></i>
                <input class="input1" type="email" placeholder="Email" name="email" required>
            </p>
            <p>
                <i class="fa fa-lock fa-2x"></i>
                <input class="input1" type="password" placeholder="Mot de passe" name="password" required>
            </p>
            <p>
                <input class="input2" type="submit" value="Se connecter">
            </p>
        </form>
    </div>
</body>
</html>