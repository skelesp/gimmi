<?php
//////////
// MAIN //
//////////

require_once "./lib/WebsiteBuilder/template.class.php";
require_once "./lib/POF/ProcessInstance.class.php";
require_once "./lib/POF/ProcessEngine.class.php";
require_once "./lib/GIMMI/Person.class.php";

session_start();

//Site / Page Info (uit WebsiteBuilder database in de toekomst)
// Pagina's die nodig zijn:
// LayoutTemplate 	= template die zorgt voor omkaderende layout (zodat elke pagina zelfde footer etc heeft)
//					= hierin zit een token naar vaste layout (bv. login/footer/navigation/...)
// ContentTemplate 	= template die beschrijft welke info er op de pagina moet verschijnen
// 					= hierin zitten alle content tokens

//		Page     	|  Layout Template    |  Content Template    |      Title      |       Content      |
//      ------------|---------------------|----------------------|-----------------|--------------------|
//      Portal   	|	GimmiLayout.html  | portal.html    	  	 |   "Fix string"  |    "Fix content"   |
//      Activity 	|	GimmiLayout.html  | activity.html  	  	 | "Variable name" | "Variable content" |
//		Login	 	|	GimmiLayout.html  | login.html			 |   "Fix String"  | "Variable content" |
//		Help	 	|	GimmiLayout.html  | help.html      	  	 |   "Fix string"  |    "Fix content"   |
//		UserPortal	|	GimmiLayout.html  | user_portal.html  	 |   "Fix string"  |    "Fix content"   |

/* //DEBUGGING via var dump of session
ob_start();
var_dump($_SESSION);
$data = ob_get_clean();
$data = "************************ NEW PAGE ****************** \r\n\r\n".$data."<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\r\n\r\n\r\n";
$fp = fopen("DEBUG_LOG_gimmi.txt", "a");
fwrite($fp, $data);
fclose($fp); 
// END OF DEBUGGING */

$siteTitle = "GIMMI";
$siteSubtitle = "Making wishes come true";
$siteContent = "GIMMI v0.1 - POF V0.3 +++ Content under construction";

//Process Info
$activity = "";
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
	$loginStatus = "Logged in as ".$user->getfirstName();
	
	if (isset($_GET['logout']) && $_GET['logout'] == 1) { // logout request
		$user->logout();
	}
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

//Get templates
$loginBlockLayout = new Template("./layout/ResponsiveDesignTXT/login_block.html");
$loginMenu = "";
// TODO: op een andere manier controleren of user ingelogd is (via method van Person class)
if ($loginStatus != "Login"){ // user is logged in
	$loginMenuLayout = new Template("./layout/ResponsiveDesignTXT/user_menu.html");
	$loginMenu = $loginMenuLayout->parse();
} else {
	// $frmID = "login";
	// include ("./processes/forms/frm-login.php");
	// $loginMenu = $formHTML;
}
$pageLayout = new Template("./layout".$templateFile);
	
// Create site content
$siteContent = $_SESSION['content'];

// DEBUGGING: voeg $_SESSION['DEBUG_message'] toe aan code om een debugbericht te tonen vanuit gelijk welke plaats in de code.
$debugMessage = "..";
if ( isset($_SESSION['DEBUG_message']) && !empty($_SESSION['DEBUG_message']) ) {
	$debugMessage = "<br /><br />DEBUGGING<br /><br />".$_SESSION['DEBUG_message'];
}

//Create tokens
$loginBlockLayout->setToken("login.status", $loginStatus);
$loginBlockLayout->setToken("login.menu",$loginMenu);

$pageLayout->setToken("debugging",$debugMessage);
$pageLayout->setToken("site.title",$siteTitle);
$pageLayout->setToken("site.subtitle", $siteSubtitle);
$pageLayout->setToken("site.content", $siteContent);
$pageLayout->setToken("content.header", $activity);
$pageLayout->setToken("content.text", "");
$pageLayout->setToken("process.name", $processName);
$pageLayout->setToken("process.activity", $processStatus);
$pageLayout->setToken("login_block", $loginBlockLayout->parse());

//Parse template
print $pageLayout->parse();

unset( $_SESSION['DEBUG_message'] );
unset( $_SESSION['content'] );
unset( $_SESSION['pfbc'] );
unset( $_SESSION['o_Wish'] );
?>