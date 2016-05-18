<?php 
//
require_once "./lib/GIMMI/User.class.php";
require_once "./lib/GIMMI/Person.class.php";

 
$user = new User("stijn", "stijn");

if ($user->isAuthenticated()) {
	echo "user '".$user->getLogin()."' is logged in";
} else {
	if ($user->authenticate() ) {
		echo $user;
		
	} else {
		echo "authentication error!";
	}
};
?>