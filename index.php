<?php
require_once('server/User.php');
    if(!isset($_GET['id'])){
        header( 'Location: error.php' );
    }
    else{
        $user = User::retrieveUserFromDB($_GET['id']);
    }
?>
<!DOCTYPE html>
<html>
<head>
    <title>Turkey Shoot!</title>
    <link href='http://fonts.googleapis.com/css?family=Lato:100,300,400,700,900,100italic,300italic,400italic,700italic,900italic' rel='stylesheet' type='text/css'>
    <link href="css/game.css" type="text/css" rel="stylesheet"/>
    <script src="js/prefixfree.min.js" type="text/javascript"></script>
    <script src="js/prototype.min.js" type="text/javascript"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js" type="text/javascript"></script>
    <script src="js/buzz.min.js" type="text/javascript"></script>
    <script src="js/imagepreloader.min.js" type="text/javascript"></script>
    <script src="js/PolySprite.min.js" type="text/javascript"></script>
   <script src="js/allSprites.min.js" type="text/javascript"></script>
	<script>
       var userScore = <?php echo $user->getUserHighscore();?>;
        var userID =  <?php echo $user->getUserId();?>;
    </script>
    <script src="js/game.js" type="text/javascript"></script>

</head>
<body>


<div id="gameArea">

    <canvas id="canvas"  >
        Your browser does not support HTML5 canvas
    </canvas>
    <audio id="bang">
        <source src="sounds/gunshot.mp3" />
        <source src="sounds/gunshot.ogg" />
        <sound src="sounds/gunshot.wav" />
        <source src="sounds/gunshot.aac" />
    </audio>
</div>

</body>
</html>