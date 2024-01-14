    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>complete responsive travel website design tutorial</title>

        <!-- font awesome cdn link  -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

        <!-- custom css file link  -->
        <link rel="stylesheet" href="style.css">

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css">

        <!-- custom js file link  -->
        <script src="js/script.js" defer></script>

    </head>
    <body>
    <?php

    $conn = mysqli_connect('localhost','root','','travel') or die('connection failed');

    session_start();

    $user_id = $_SESSION['user_id'];

    if(!isset($user_id)){
        echo("hjdsj");

    };
    ?>
    <!-- header section starts  -->

    <header class="header">

        <div id="menu-btn" class="fas fa-bars"></div>

        <a data-aos="zoom-in-left" data-aos-delay="150" href="home.html" class="logo"> <i class="fas fa-paper-plane"></i>travel </a>

        <nav class="navbar">
            <a data-aos="zoom-in-left" data-aos-delay="300" href="#home">home</a>
            <a data-aos="zoom-in-left" data-aos-delay="450" href="about.html">about</a>
            <a data-aos="zoom-in-left" data-aos-delay="600" href="destination.html">destination</a>
            <a data-aos="zoom-in-left" data-aos-delay="750" href="service.html">services</a>
            <a data-aos="zoom-in-left" data-aos-delay="900" href="gallery.html">gallery</a>
            <a data-aos="zoom-in-left" data-aos-delay="1150" href="blogs.html">blogs</a>
        </nav>
        <a data-aos="zoom-in-left" data-aos-delay="1300" href="reservation.php" class="btn">book now</a>
        <a data-aos="zoom-in-left" data-aos-delay="1450" href="login.php" class="btn">Login</a>
    </header>

    <!-- header section ends -->

    <!-- home section starts  -->

    <section class="home" id="home">

        <div class="content">
            <span data-aos="fade-up" data-aos-delay="150">follow us</span>
            <h3 data-aos="fade-up" data-aos-delay="300">to the unknown</h3>
            <p data-aos="fade-up" data-aos-delay="450">Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus quia illum quod perspiciatis harum in possimus? Totam consequuntur officia quia?</p>
            <a data-aos="fade-up" data-aos-delay="600" href="reservation.php" class="btn">book now</a>
        </div>

    </section>

        <section class="destination" id="destination">

            <div class="box-container">
        
                <div class="box" data-aos="fade-up" data-aos-delay="150">
                    <div class="image">
                        <img src="t.jpg" alt="">
                    </div>
                    <div class="content">
                        <p>Traveling is a return to the essentials.</p>
                    </div>
                </div>
        
                <div class="box" data-aos="fade-up" data-aos-delay="300">
                    <div class="image">
                        <img src="t2.jpg" alt="">
                        </div>
                    <div class="content">
                        <p>We must never forget the explorer’s spirit</p>
                    </div>
                </div>
        
                <div class="box" data-aos="fade-up" data-aos-delay="450">
                    <div class="image">
                        <img src="t3.jpg" alt="">
                    </div>
                    <div class="content">
                        <p> your feet will bring you to where your heart is  .</p>
                        
                    </div>
                </div>
                <div class="box" data-aos="fade-up" data-aos-delay="600">
                    <div class="image">
                        <img src="t4.jpg" alt="">
                    </div>
                    <div class="content">
                        <p>you will reach your destination even though you travel slowly.</p>
                        
                    </div>
                </div>
        
            </div>
        
        </section>
        

    <!-- footer section starts  -->

    <section class="footer">

        <div class="box-container">

            <div class="box" data-aos="fade-up" data-aos-delay="150">
                <a href="#" class="logo"> <i class="fas fa-paper-plane"></i>travel </a>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, ad?</p>
                <div class="share">
                    <a href="#" class="fab fa-facebook-f"></a>
                    <a href="#" class="fab fa-twitter"></a>
                    <a href="#" class="fab fa-instagram"></a>
                    <a href="#" class="fab fa-linkedin"></a>
                </div>
            </div>

            <div class="box" data-aos="fade-up" data-aos-delay="300">
                <h3>quick links</h3>
                <a href="home.html" class="links"> <i class="fas fa-arrow-right"></i> home </a>
                <a href="about.html" class="links"> <i class="fas fa-arrow-right"></i> about </a>
                <a href="destination.html" class="links"> <i class="fas fa-arrow-right"></i> destination </a>
                <a href="service.html" class="links"> <i class="fas fa-arrow-right"></i> services </a>
                <a href="gallery.html" class="links"> <i class="fas fa-arrow-right"></i> gallery </a>
                <a href="blogs.html" class="links"> <i class="fas fa-arrow-right"></i> blogs </a>
            </div>

            <div class="box" data-aos="fade-up" data-aos-delay="450">
                <h3>contact info</h3>
                <p> <i class="fas fa-map"></i> monastir, Ksar Hellal</p>
                <p> <i class="fas fa-phone"></i> +21651740743 </p>
                <p> <i class="fas fa-envelope"></i> nourhenelahouel10@gmail.com </p>
                <p> <i class="fas fa-clock"></i> 8:00am - 6:00pm </p>
            </div>
            <div class="box" data-aos="fade-up" data-aos-delay="600">
                <h3>Newsletter</h3>
                <p>subscribe for latest updates</p>
                <form action="" id="f1" method="POST">
                    <input type="email" name="" placeholder="enter your email" class="email" id="">
                    <input type="text" name="" placeholder="enter your message" class="email" name="msg" id="">
                    <input type="submit" value="subscribe" class="btn">
                </form>
            </div>

        </div>
<a href="afficher.php">les res</a>
    </section>

    <div class="credit">created by <span>Mrs. NourHene</span> | all rights reserved!</div>

    <!-- footer section ends -->



    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

    <script>

        AOS.init({
            duration: 800,
            offset:150,
        });

    </script>

    </body>
    </html>