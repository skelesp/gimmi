<?php
require_once "./lib/GIMMI/Wish.class.php";
require_once "./lib/GIMMI/Person.class.php";

/**
 * This activity will make it possible to create a wish.
 * 
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 15-nov-2015 15:51:14
 */

// Process variables
//var_dump($_SESSION);
$_SESSION['content'] = $_SESSION['content']."<br/>TestActivity";
$activityFinished = true;

?>