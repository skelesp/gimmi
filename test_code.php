<?php 

require_once "./lib/POF/ProcessEngine.class.php";
require_once "./lib/POF/Process.class.php";
require_once "./lib/POF/ProcessInstance.class.php";
require_once "./lib/WebsiteBuilder/template.class.php";
require_once "./lib/GIMMI/Person.class.php";
require_once "./lib/GIMMI/User.class.php";
require_once "./lib/GIMMI/Wish.class.php";
require_once "./lib/global_functions.php";


session_start();
//USER management
$user = new User("stijn","stijn");
if($user->authenticate()){
	$_SESSION['user'] = $user;
	$_SESSION['wishReceiver'] = $user;
}

//PROCESS management
$_SESSION["content"]="";
$_SESSION["DEBUG_message"]="";

$processID = 2;
$instanceID = 11;
$processEngine = new ProcessEngine (new ProcessInstance(new Process($processID),$instanceID));

$processInstance = $processEngine->getInstance();

println ($processInstance);
println (" with current element: ".$processInstance->getCurrentElement()."<br />");

$processEngine->executeElement();

//$processEngine->executeElement();
println("content:".$_SESSION["content"]);
println("debug:".$_SESSION["DEBUG_message"]);


?>