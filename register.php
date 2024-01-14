<?php

// Vérifie si le formulaire a été soumis
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Récupère les données du formulaire
    $nom = $_POST['nom'] ?? '';
    $prenom = $_POST['prenom'] ?? '';
    $cin = $_POST['cin'] ?? '';
    $email = $_POST['email'] ?? '';
    $passworde = $_POST['password'] ?? '';

    // Connexion à la base de données
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "travel";

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Vérifie si la connexion a réussi
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prépare la requête d'insertion
    $sql = "INSERT INTO client (nom, prenom,cin, email, password) VALUES ('$nom', '$prenom',$cin, '$email', '$passworde')";

    // Exécute la requête
    if ($conn->query($sql) === TRUE) {
        echo "Enregistrement réussi";
    } else {
        echo "Erreur d'enregistrement: " . $conn->error;
    }

    // Ferme la connexion
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-QJw0ET2D+e4I4Kt1F+0x22JtP9ViTCK+St57Ojj/HwRwOQU1siF1+vvv2KvlIbOx+TJq3I76ZxxaJdKmRcRz1g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <title>Register</title>
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
            height: 750px;
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
    padding: 12px 20px;
    margin: 20px 0;
    border: none;
    border-radius: 4px;
    background-color: #f1f1f1;
}
</style>
</head>
<body>
    <div class="global">
        <h1>Inscription</h1>
        <form method="post">
        <p>
            <i class="fa fa-map-marker fa-2x"></i>
            <input type="text" placeholder="nom" name="nom" required>
        </p>    
        <p>
            <i class="fa fa-user fa-2x"></i>
            <input type="text" placeholder="Prénom" name="prenom" required>
        </p>
        <p>
            <i class="fa fa-envelope fa-2x"></i>
            <input type="email" placeholder="Email" name="email" required>
        </p>
        
        <p>
            <i class="fa fa-envelope fa-2x"></i>
            <input type="text" placeholder="cin" name="cin" required>
        </p>
        <p>
            <i class="fa fa-lock fa-2x"></i>
            <input type="password" placeholder="Mot de passe" name="password" required>
        </p>
        <p>
            <input type="submit" value="S'inscrire">
        </p>
    </form>
</div>
</body>
</html>