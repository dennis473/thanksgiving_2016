<?php
require_once("User.php");

$user = User::retrieveUserFromDB(1);
echo
$user->getUserHighscore();


?>