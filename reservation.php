<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>checkout</title>

   <!-- font awesome cdn link  -->
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

   <!-- custom css file link  -->

</head>
<?php
// Connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "travel";

$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Vérifier si le formulaire a été soumis
if (isset($_POST["order_btn"])) {
 
    // Récupérer les valeurs soumises
    $place = $_POST["place"];
    $date = $_POST["date"];
    $nbp = $_POST["nbp"];
    $name = $_POST["name"];
    $number = $_POST["number"];
    $email = $_POST["email"];
    $method = $_POST["method"];
    $cin = $_POST["cin"];
    $street = $_POST["street"];
    $city = $_POST["city"];
    $state = $_POST["state"];
    $country = $_POST["country"];
    $pin_code = $_POST["pin_code"];

  // Préparer et exécuter la requête d'insertion
$sql = "INSERT INTO orders (place, date, nbp, name, number, email, method, cin, street, city, state, country, pin_code)
VALUES ('$place', '$date', '$nbp', '$name', '$number', '$email', '$method', '$cin', '$street', '$city', '$state', '$country', '$pin_code')";

if ($conn->query($sql) === TRUE) {
echo "New record created successfully";
} else {
echo "Error: " . $sql . "<br>" . $conn->error;
}
}
  

?>
<style>
    .checkout form{
        max-width: 1200px;
        padding:2rem;
        margin:0 auto;
        border:var(--border);
        background-color: var(--light-bg);
        border-radius: .5rem;
     }
     
     .checkout form h3{
        text-align: center;
        margin-bottom: 2rem;
        color:var(--black);
        text-transform: uppercase;
        font-size: 3rem;
     }
     
     .checkout form .flex{
        display: flex;
        flex-wrap: wrap;
        gap:1.5rem;
     }
     
     .checkout form .flex .inputBox{
        flex:1 1 40rem;
     }
     
     .checkout form .flex span{
        font-size: 2rem;
        color:var(--black);
     }
     
     .checkout form .flex select,
     .checkout form .flex input{
        border:var(--border);
        width: 100%;
        border-radius: .5rem;
        width: 100%;
        background-color: var(--white);
        padding:1.2rem 1.4rem;
        font-size: 1.8rem;
        margin:1rem 0;
     }
     @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600&display=swap');
     
     :root{
        --purple:rgb(255,210,15);
        --red:#c0392b;
        --orange:#f39c12;
        --black:#333;
        --white:#fff;
        --light-color:#666;
        --light-white:#ccc;
        --light-bg:#f5f5f5;
        --border:.1rem solid var(--black);
        --box-shadow:0 .5rem 1rem rgba(0,0,0,.1);
     }
     
     *{
        font-family: 'Rubik', sans-serif;
        margin:0; padding:0;
        box-sizing: border-box;
        outline: none; border:none;
        text-decoration: none;
        transition:all .2s linear;
     }
     
     *::selection{
        background-color: var(--purple);
        color:var(--white);
     }
     
     *::-webkit-scrollbar{
        height: .5rem;
        width: 1rem;
     }
     
     *::-webkit-scrollbar-track{
        background-color: transparent;
     }
     
     *::-webkit-scrollbar-thumb{
        background-color: var(--purple);
     }
     
     html{
        font-size: 62.5%;
        overflow-x: hidden;
     }
        /* Style des éléments input */
input[type="text"],
input[type="email"],
input[type="number"],
input[type="date"],
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 4px;
  background-color: #f1f1f1;
}

/* Style des éléments input : focus */
input[type="text"]:focus,
input[type="email"]:focus,
input[type="number"]:focus,
input[type="date"]:focus,
select:focus {
  background-color: #ddd;
  outline: none;
}

/* Style du bouton "find now" */
.btn {
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease 0s;
}

.btn:hover {
  background-color: #555;
}

/* Style des éléments de formulaire à deux colonnes */
.flex {
  display: flex;
  flex-wrap: wrap;
}

.flex .inputBox {
  flex: 50%;
}

/* Style du formulaire */
.book-form {
  margin: 50px auto;
  width: 50%;
  max-width: 600px;
  text-align: center;
}

.book-form h2 {
  margin-bottom: 50px;
  font-weight: 700;
  color: #333;
}

.book-form span {
  display: block;
  text-align: left;
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}

.book-form input[type="submit"] {
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease 0s;
}

.book-form input[type="submit"]:hover {
  background-color: #555;
}

/* Style des messages d'erreur */
.error-message {
  color: #f44336;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 20px;
  text-align: left;
}

</style>
<!-- home section ends -->
<body>
    <!-- booking form section starts  -->

    <section class="book-form" id="book-form">

        <form action="" method="POST">
            <div data-aos="zoom-in" data-aos-delay="150" class="inputBox">
                <span>where to?</span>
                <input type="text" placeholder="place name" name="place" value="">
            </div>
            <div data-aos="zoom-in" data-aos-delay="300" class="inputBox">
                <span>when?</span>
                <input type="date" name="date" value="">
            </div>
            <div data-aos="zoom-in" data-aos-delay="450" class="inputBox">
                <span>how many?</span>
                <input type="number" name="nbp" placeholder="number of travelers" value="">
            </div>
        <div class="flex">
         <div class="inputBox">
            <span>your name :</span>
            <input type="text" name="name" required placeholder="enter your name">
         </div>
         <div class="inputBox">
            <span>your number :</span>
            <input type="number" name="number" required placeholder="enter your number">
         </div>
         <div class="inputBox">
            <span>your email :</span>
            <input type="email" name="email" required placeholder="enter your email">
         </div>
         <div class="inputBox">
            <span>Payment method :</span>
            <select name="method">
               <option value="cash on delivery">cash on delivery</option>
               <option value="credit card">credit card</option>
               <option value="paypal">paypal</option>
            </select>
         </div>
         <div class="inputBox">
            <span>cin :</span>
            <input type="text" min="0" name="cin" required placeholder="01234567">
         </div>
         <div class="inputBox">
            <span>address line 01 :</span>
            <input type="text" name="street" required placeholder="e.g. street name">
         </div>
         <div class="inputBox">
            <span>city :</span>
            <input type="text" name="city" required placeholder="e.g. ksar hellal">
         </div>
         <div class="inputBox">
            <span>state :</span>
            <input type="text" name="state" required placeholder="e.g. monasrit">
         </div>
         <div class="inputBox">
            <span>country :</span>
            <input type="text" name="country" required placeholder="e.g. tunisie">
         </div>
         <div class="inputBox">
            <span>pin code :</span>
            <input type="number" min="0" name="pin_code" required placeholder="e.g. 5070">
         </div>
      </div>
      <input type="submit" value="order now"  name="order_btn">
         </form>
    </section>
  
<!-- custom js file link  -->
<script src="js/script.js"></script>

</body>
</html>