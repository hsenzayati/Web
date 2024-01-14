<?php
$conn = mysqli_connect('localhost','root','','travel') or die('connection failed');

session_start();

if(isset($_POST['submit'])){

   $email = mysqli_real_escape_string($conn, $_POST['email']);
   $pass = mysqli_real_escape_string($conn, md5($_POST['password']));

   $select_users = mysqli_query($conn, "SELECT * FROM `client` WHERE email = '$email' AND password = '$pass'") or die('query failed');

   if(mysqli_num_rows($select_users) > 0){
         $row = mysqli_fetch_assoc($select_users);
         $_SESSION['nom'] = $row['nom'];
         $_SESSION['prenom'] = $row['prenom'];
         $_SESSION['email'] = $row['email'];
         $_SESSION['id'] = $row['id'];
         header('location:home.php');

      } else {
         $message = 'Adresse email ou mot de passe incorrect!';
         header('location:login.php?message=' . $message);
         exit();
      }

} else {
   $message = 'Erreur lors de la soumission du formulaire.';
   header('location:login.php?message=' . $message);
   exit();
}

?>
