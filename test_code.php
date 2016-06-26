<?php 

require_once "./lib/POF/ProcessEngine.class.php";
require_once "./lib/POF/Process.class.php";
require_once "./lib/POF/ProcessInstance.class.php";
require_once "./lib/WebsiteBuilder/template.class.php";
require_once "./lib/GIMMI/Person.class.php";
require_once "./lib/GIMMI/User.class.php";
require_once "./lib/GIMMI/Wish.class.php";


session_start();
//USER management
$user = new User("stijn","stijn");
if($user->authenticate()){
	$_SESSION['user'] = $user;
	$_SESSION['wishReceiver'] = $user;
}

//PROCESS management
$processID = 2;
$instanceID = 1;
$processEngine = new ProcessEngine (new ProcessInstance(new Process($processID),$instanceID));

$processInstance = $processEngine->getInstance();

println ($processInstance);
println (" with current element: ".$processInstance->getCurrentElement()."<br />");

$processEngine->determineNextAction();

//$processEngine->executeElement();
println("content:".$_SESSION["content"]);
println("debug:".$_SESSION["DEBUG_message"]);


/********************/
/* Global functions */
/********************/

function println ($string){
	echo $string."<br />";
}

?>