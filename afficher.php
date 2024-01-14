<?php
// Connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "travel";

$conn = new mysqli($servername, $username, $password, $dbname);

// Vérification de la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Requête SQL pour récupérer toutes les réservations avec les informations du client associé
$sql = "SELECT *
        FROM orders
        JOIN client
        ON orders.cin = client.cin
        ORDER BY client.cin";

$result = $conn->query($sql);

// Affichage des résultats dans un tableau HTML
if ($result->num_rows > 0) {
    echo "<table>";
    echo "<tr><th>ID</th><th>Date</th><th>CIN</th><th>Nom</th><th>Prénom</th><th>Email</th><th>Lieu</th><th>Nombre de personnes</th><th>Méthode de paiement</th><th>Rue</th><th>Ville</th><th>État</th><th>Pays</th><th>Code PIN</th></tr>";
    while($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>".$row["id"]."</td>";
        echo "<td>".$row["order_date"]."</td>";
        echo "<td>".$row["cin"]."</td>";
        echo "<td>".$row["nom"]."</td>";
        echo "<td>".$row["prenom"]."</td>";
        echo "<td>".$row["email"]."</td>";
        echo "<td>".$row["place"]."</td>";
        echo "<td>".$row["nbp"]."</td>";
        echo "<td>".$row["method"]."</td>";
        echo "<td>".$row["street"]."</td>";
        echo "<td>".$row["city"]."</td>";
        echo "<td>".$row["state"]."</td>";
        echo "<td>".$row["country"]."</td>";
        echo "<td>".$row["pin_code"]."</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "Aucun résultat trouvé.";
}

// Fermeture de la connexion à la base de données
$conn->close();
?>
<style>
    table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  text-align: left;
  padding: 8px;
}

th {
  background-color: #4CAF50;
  color: white;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

    </style>
