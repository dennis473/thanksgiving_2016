<?php
/**
 * Created by PhpStorm.
 * User: mccarthyk
 * Date: 11/20/2014
 * Time: 10:03 AM
 */
require_once("Database.php");
use \Database;



class User {

    private $user_id;
    private $user_fname;
    private $user_lname;
    private $user_highscore;
    private $user_email;

    function __construct($user_id, $user_fname, $user_lname, $user_highscore)
    {
        $this->user_id = $user_id;
        $this->user_fname = $user_fname;
        $this->user_lname = $user_lname;
        $this->user_highscore = $user_highscore;
        $this->user_email = null;
    }

    public function getUserEmail()
    {
        return $this->user_email;
    }
    public function setUserEmail($user_email)
    {
        $this->user_email = $user_email;
    }

    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->user_id;
    }

    /**
     * @param mixed $user_id
     */
    public function setUserId($user_id)
    {
        $this->user_id = $user_id;
    }

    /**
     * @return mixed
     */
    public function getUserFname()
    {
        return $this->user_fname;
    }

    /**
     * @param mixed $user_fname
     */
    public function setUserFname($user_fname)
    {
        $this->user_fname = $user_fname;
    }

    /**
     * @return mixed
     */
    public function getUserLname()
    {
        return $this->user_lname;
    }

    /**
     * @param mixed $user_lname
     */
    public function setUserLname($user_lname)
    {
        $this->user_lname = $user_lname;
    }

    /**
     * @return mixed
     */
    public function getUserHighscore()
    {
        return $this->user_highscore;
    }

    /**
     * @param mixed $user_highscore
     */
    public function setUserHighscore($user_highscore)
    {
        $this->user_highscore = $user_highscore;
    }

    public static function deserialize($result)
    {
        $user = new User($result["user_id"], $result["user_fname"], $result["user_lname"], $result["user_highscore"]);
        return $user;
    }

    public static function retrieveUserFromDB($id)
    {

        $db = Database::getInstance();
        $connection = $db->getConnection();
        if($connection->connect_errno)
        {
            return null;
        }
        $query = "SELECT * FROM user WHERE user_id=";
        $query .= $id;
        $query .= " LIMIT 1";
        $result = $connection->query($query);
        $object = $result->fetch_assoc();
        if($result)
        {
            if($object)
            {
                $user = self::deserialize($object);
                return $user;
            }
        }

        else{
            return null;
        }
    }

    public static function updateUserScore ($id, $score)
    {
        $db = Database::getInstance();
        $connection = $db->getConnection();

        if($connection->connect_errno){
            return null;
        }
        $user = self::retrieveUserFromDB($id);
        $highScore = $user->getUserHighscore();

        if($score > $highScore)
        {
            $query = "UPDATE user SET user_highscore=" . $score . " WHERE user_id=" . $id;
            $connection->query($query);
            return $score;
        }
        else{
            return $highScore;
        }


    }


} 