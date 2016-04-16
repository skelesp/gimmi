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

//Process Info
$activity = "";
$activityState = "";
$activityID = 'p1_a1';
$processID =  (isset($_GET['pid']) && is_numeric($_GET['pid'])) ? htmlspecialchars($_GET['pid']) : null;
$processInstanceID = (isset($_GET['iid']) && is_numeric($_GET['iid'])) ? htmlspecialchars($_GET['iid']) : null;

//Variables
$_SESSION['content'] = "";
$processName = "";
$processStatus = "";
$loginStatus = "Login";

// Check user login
if (isset($_SESSION['user']) && !empty($_SESSION['user'])){
	$user = $_SESSION['user'];
	$loginStatus = "Logged in as ".$user->getFirstName();
}

// Generate content

	if ( ! is_null($processInstanceID) ) { //er werd een iid doorgeven (= activiteit geopend in running processInstance)
		// TODO: ProcessInstance opstarten hier!
		$processEngine = new ProcessEngine ($processInstance); // TODO: ProcessInstance moet obv iid gecreëerd worden: dit kan momementeel niet in de huidige ProcessInstance class --> te onderzoeken
		$processEngine->determineNextAction();
		$processName = (string) $processEngine->processInstance;
		$processStatus = $processEngine->getInstance()->getCurrentElement();
		
		//template info
		$templateFile = "/ResponsiveDesignTXT/activity.html";
				
	} else if (! is_null($processID) ) { // procesID werd doorgegeven (=een proces werd opgestart)
		
		$processEngine = new ProcessEngine (new ProcessInstance($processID));
		$processEngine->determineNextAction();
		$processName = (string) $processEngine->getInstance();
		$processStatus = $processEngine->getInstance()->getCurrentElement();
		
		//template info
		$templateFile = "/ResponsiveDesignTXT/activity.html";

	} else {
		
		$templateFile = "/ResponsiveDesignTXT/portal.html";
		
	}

//Get template
$pageLayout = new Template("./layout".$templateFile);
	
// Create site content
$siteContent = $_SESSION['content'];

// DEBUGGING: voeg $_SESSION['DEBUG_message'] toe aan code om een debugbericht te tonen vanuit gelijk welke plaats in de code.
if ( isset($_SESSION['DEBUG_message']) && !empty($_SESSION['DEBUG_message']) ) {
	$debugMessage = "<br /><br />DEBUGGING<br /><br />".$_SESSION['DEBUG_message'];
	$siteContent = $siteContent.$debugMessage;
	unset( $_SESSION['DEBUG_message'] );
}

//Create tokens
$pageLayout->setToken("site.title",$siteTitle);
$pageLayout->setToken("site.subtitle", $siteSubtitle);
$pageLayout->setToken("site.content", $siteContent);
$pageLayout->setToken("content.header", $activity);
$pageLayout->setToken("content.text", "");
$pageLayout->setToken("process.name", $processName);
$pageLayout->setToken("process.activity", $processStatus);
$pageLayout->setToken("login", $loginStatus);

//Parse template
print $pageLayout->parse();
?>