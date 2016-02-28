<?php
//////////
// MAIN //
//////////

//Variables
$sSiteTitle = "Geemee v0.1 - POF V0.3";
$sSiteContent = "Content under construction";

//Create header
$sSiteHeaderTitle = html_wrapper($sSiteTitle, "title");
$sHead = html_wrapper($sSiteHeaderTitle, "head");

//Generate content
$activity = "Make_a_wish";
include "processes/activities/act_".$activity.".php";

//Create site content
$sSiteContent = $output;

//DEBUGGING: voeg $_SESSION['DEBUG_message'] toe aan code om een debugbericht te tonen vanuit gelijk welke plaats in de code.
if ( isset($_SESSION['DEBUG_message']) && !empty($_SESSION['DEBUG_message']) ) {
	$debugMessage = "<br /><br />DEBUGGING<br /><br />".$_SESSION['DEBUG_message'];
	$sSiteContent = $sSiteContent.$debugMessage;
	unset( $_SESSION['DEBUG_message'] );
}


$sBody = "";
$sBody = $sBody.html_wrapper($sSiteTitle, "h1");
$sBody = $sBody.html_wrapper($activity." - ".$activityState."<br/>", "h2");
$sBody = $sBody.html_wrapper($sSiteContent, "p");

print $sBody;

// FUNCTIONS

//Wrap HTML tags around content
function html_wrapper($sText, $sTag){
	return "<".$sTag.">".$sText."</".$sTag.">";
}

?>