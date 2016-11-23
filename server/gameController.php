<?php
require_once('User.php');
if(isset($_POST['id'])){
    if(is_numeric($_POST['id'])){
        echo json_encode(USER::updateUserScore($_POST['id'],$_POST['score']));
    }
}