<?php
// MAIN

//Variables
$sSiteTitle = "Geemee v0.1";
$sSiteContent = "Content under construction";

//Create header
$sSiteHeaderTitle = html_wrapper($sSiteTitle, "title");
$sHead = html_wrapper($sSiteHeaderTitle, "head");

//Generate content
$activity = "Make_a_wish";
include "processes/activities/act_".$activity.".php";

//Create site content
$sSiteContent = $output;

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