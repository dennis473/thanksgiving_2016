<?php

use \Mysqli as mysqli;

class Database {
    protected $connection;
    protected static $_instance;

    public static function getInstance()
    {
        if(!self::$_instance)
        {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    protected function __construct()
    {

        $this->connection = new mysqli("host","user","passwd","database", "port");
      

        if(mysqli_connect_error())
        {
            trigger_error("Failed to connect to MySQL: " . mysqli_connect_error(),E_USER_ERROR);
        }
    }

    private function __clone(){

    }  //prevent clone magic duplication

    public function getConnection()
    {
        return $this->connection;
    }
    public function closeConnection()
    {
        $this->connection->close();
    }


}









