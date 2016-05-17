<?php 

require_once "./lib/GIMMI/User.class.php";

$user = new User("stijn", "stijn");

if ($user->isAuthenticated()) {
	echo "user '".$user->getLogin()."' is logged in";
} else {
	if ($user->authenticate() ) {
		echo "Authenticated!!";
	} else {
		echo "authentication error!";
	}
};

?>