<?php
//////////
// MAIN //
//////////

require_once "./lib/WebsiteBuilder/template.class.php";
require_once "./lib/POF/processInstance.class.php";
require_once "./lib/POF/processEngine.class.php";

session_start();
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

//Process Info (uit POF database)
$activity = "Add or Search a gift idea";
$activityState = "";
$activityID = 'p1_a1';
$processID =  (isset($_GET['pid']) && is_numeric($_GET['pid'])) ? htmlspecialchars($_GET['pid']) : 0;
$processInstance = new ProcessInstance ($processID);

//Variables
$_SESSION['content'] = "";

// Generate content
$templateFile = "/ResponsiveDesignTXT/portal.html";

if ( isset($_SESSION[$activityID]) && !empty($_SESSION[$activityID]) ) {
	
	$activity = "Make_a_wish";
	include "./processes/activities/act_".$activity.".php";
	$templateFile = "/ResponsiveDesignTXT/activity.html";
		
} else if ( isset($processID) && !empty($processID) ) {
	
	$processEngine = new ProcessEngine ($processInstance);
	$processEngine->determineNextAction();
	$templateFile = "/ResponsiveDesignTXT/activity.html";
	
}

// Create site content
$siteContent = $_SESSION['content'];

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
$pageLayout->setToken("process.name", $processInstance);
$pageLayout->setToken("process.activity", $activity." - ".$activityState);
$pageLayout->setToken("content.header", $activity);

//Parse template
print $pageLayout->parse();

?>