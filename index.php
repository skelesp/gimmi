<?php
//////////
// MAIN //
//////////

//Variables
$siteTitle = "GIMMI";
$siteSubtitle = "Making wishes come true";
$siteContent = "GIMMI v0.1 - POF V0.3 +++ Content under construction";
$activity = "Choose your gift idea action";
$activityInfo = "Search, Order, Give or Add a gift idea";

// Generate content
$activity = "Make_a_wish";
$activityInfo = "Maak een wens aan.";
include "processes/activities/act_".$activity.".php";

// Create site content
$siteContent = $output;

// DEBUGGING: voeg $_SESSION['DEBUG_message'] toe aan code om een debugbericht te tonen vanuit gelijk welke plaats in de code.
if ( isset($_SESSION['DEBUG_message']) && !empty($_SESSION['DEBUG_message']) ) {
	$debugMessage = "<br /><br />DEBUGGING<br /><br />".$_SESSION['DEBUG_message'];
	$siteContent = $siteContent.$debugMessage;
	unset( $_SESSION['DEBUG_message'] );
}

$pageLayout = new Template("layout/ResponsiveDesignTXT/activity.html");
$pageLayout->setToken("site.title",$siteTitle);
$pageLayout->setToken("site.subtitle", $siteSubtitle);
$pageLayout->setToken("site.content", $siteContent);
$pageLayout->setToken("activity.name", $activity);
$pageLayout->setToken("activity.info", $activityState);
$pageLayout->setToken("process.activity", $activity." - ".$activityInfo);

print $pageLayout->parse();

// Template class

class Template {
	protected $file;
	protected $values = array();
	
	public function __construct($file) {
		$this->file = $file;
	}
	
	public function setToken($key, $value) {
		$this->values[$key] = $value;
	}
	
	public function parse() {
		if (!file_exists($this->file)) {
			return "Error loading template file".$this->file.".";
		}
		$output = file_get_contents($this->file);
		
		foreach ($this->values as $key => $value) {
			$tagToReplace = "[@".$key."]";
			$output = str_replace($tagToReplace, $value, $output);
		}
		
		return $output;
	}
}

?>