<?php
//////////
// MAIN //
//////////

require_once "./lib/WebsiteBuilder/template.class.php";
require_once "./lib/POF/processInstance.class.php";

//Site / Page Info (uit WebsiteBuilder database in de toekomst)
// Pagina's die nodig zijn:
//		Page     |    Template    |      Title      |       Content      |
//      ---------|----------------|-----------------|--------------------|
//      Portal   | portal.html    |   "Fix string"  |    "Fix content"   |
//      Activity | activity.html  | "Variable name" | "Variable content" |
//		Help	 | help.html      |   "Fix string"  |    "Fix content"   |

$siteTitle = "GIMMI";
$siteSubtitle = "Making wishes come true";
$siteContent = "GIMMI v0.1 - POF V0.3 +++ Content under construction";
$templateFile = "/ResponsiveDesignTXT/portal.html";

//Process Info (uit POF database)
$activity = "Add or Search a gift idea";
$activityInfo = "";
$activityState = "";
$activityID = "";
$processID =  (isset($_GET['pid']) && is_numeric($_GET['pid'])) ? htmlspecialchars($_GET['pid']) : 0;
$processInstance = new ProcessInstance ($processID);

//Variables
$output = "";

// Generate content
if ( isset($_SESSION[$activityID]) && !empty($_SESSION[$activityID]) ) {
	
	$activity = "Make_a_wish";
	$activityInfo = "Maak een wens aan.";
	include "./processes/activities/act_".$activity.".php";
	$templateFile = "/ResponsiveDesignTXT/activity.html";
	
} else if ( isset($processID) && !empty($processID) ) {
	
	$processInstance->trigger();
	$templateFile = "/ResponsiveDesignTXT/activity.html";
	
}

// Create site content
$siteContent = $output;

// DEBUGGING: voeg $_SESSION['DEBUG_message'] toe aan code om een debugbericht te tonen vanuit gelijk welke plaats in de code.
if ( isset($_SESSION['DEBUG_message']) && !empty($_SESSION['DEBUG_message']) ) {
	$debugMessage = "<br /><br />DEBUGGING<br /><br />".$_SESSION['DEBUG_message'];
	$siteContent = $siteContent.$debugMessage;
	unset( $_SESSION['DEBUG_message'] );
}

//Get template
$pageLayout = new Template("./layout".$templateFile);

//Create tokens
$pageLayout->setToken("site.title",$siteTitle);
$pageLayout->setToken("site.subtitle", $siteSubtitle);
$pageLayout->setToken("site.content", $siteContent);
$pageLayout->setToken("activity.name", $activity);
$pageLayout->setToken("activity.info", $activityState);
$pageLayout->setToken("process.name", ($processInstance->checkPrerequisites()==true) ? "Prereqs are ok" : "Prereqs missing");
$pageLayout->setToken("process.activity", $activity." - ".$activityInfo);
$pageLayout->setToken("content.header", $activity);
$pageLayout->setToken("content.text", $activityInfo);

//Parse template
print $pageLayout->parse();

?>