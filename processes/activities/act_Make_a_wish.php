<?php
require_once "./lib/GIMMI/Wish.class.php";
require_once "./lib/GIMMI/Person.class.php";

/**
 * This activity will make it possible to create a wish.
 * 
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 15-nov-2015 15:51:14
 */

// Process variables
$activityID = 'p1_a1';
$activityRefreshRate = 0;
$_SESSION['content'] = "";

// Check activity state
if ( !isset($_SESSION[$activityID]) || empty($_SESSION[$activityID]) ) {
	$activityState = 'start';
} else {
	$activityState = $_SESSION[$activityID];
}

switch ($activityState) {
	case 'start':
		/**
		 * START
		 * Instantiate new Wish object with default name
		 */
		$o_Wish = new Wish();
		
		// Next activity + save process instance info
		$_SESSION['o_Wish'] = $o_Wish;
		$_SESSION[$activityID] = "check owner";
		
		// automatic activity --> refresh page immediately
		header("Refresh: ".$activityRefreshRate);
		break;
		
	case 'check owner':
		/**
		 * ACT
		 * Check if the wish owner is known
		 */
		$o_Wish = $_SESSION['o_Wish'];
		include "./processes/services/srv-Check_Wish_Owner.php";
		
		// Next activity + save process instance info
		$_SESSION[$activityID] = "ask for owner";	
		$_SESSION['o_Wish'] = $o_Wish;
		$_SESSION['b_ownerKnown'] = $b_ownerKnown;
		
		// automatic activity --> refresh page immediately
		//header("Refresh: ".$activityRefreshRate);
		
		break;		
	
	case 'ask for owner':
		/**
		 * DN
		 * Is the wish owner known?
		 */	
		if (!$_SESSION['b_ownerKnown']){ /* Owner is not known */	
			/**
			 * ACT
			 * Ask for wish owner
			 */
			$frmID = "ask_for_owner";
			include "./processes/forms/frm-".$frmID.".php";
			$_SESSION['content'] = $_SESSION['content']." ".$formHTML;
			
			// Next activity + save process instance info
			$_SESSION[$activityID] = "handle owner info";
		}
		break;
		
	case 'handle owner info':
		$frmID = "wishOwner"; // get info from this form
		
		if($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['frm'] == $frmID) {
			// Store the form info in a Person object
			$wishReceiver = new Person();
			
			$wishReceiver->setlastName($_POST['owner_last']);
			$wishReceiver->setfirstName($_POST['owner_first']);
			$wishReceiver->setemail($_POST['owner_email']);
			
			$_SESSION['content'] = $_SESSION['content']." ".$wishReceiver;
			
			// Next activity + save process instance info
			$_SESSION['wishReceiver'] = $wishReceiver;
			$_SESSION[$activityID] = "check owner account";
			
		} else {
			$_SESSION['content'] = $_SESSION['content']." "."Geen ownergegevens beschikbaar";
			
			// Next activity + save process instance info
			$_SESSION[$activityID] = "ask for owner";
			
		}
		// automatic activity --> refresh page immediately
		header("Refresh: ".$activityRefreshRate);
		break;
		
	case 'check owner account':
		/**
		 * ACT
		 * Check if there is an account which corresponds to the given data
		 */
		$wishReceiver = $_SESSION['wishReceiver'];
		
		// Next activity + save process instance info
		$_SESSION[$activityID] = "create new account";
		$wishReceiver->check_for_account();
		
		$_SESSION['wishReceiver'] = $wishReceiver;
		
		// automatic activity --> refresh page immediately
		//header("Refresh: ".$activityRefreshRate);
		header("Refresh: 5");
		break;
		
	case 'create new account':
		 /**
		 * DN
		 * Wish owner has an account?
		 */	
		$wishReceiver = $_SESSION['wishReceiver'];
		
		if (!$wishReceiver->isSubscribed()) { /* owner doesn't have an account */
		/**
		 * ACT
		 * Create a new person account
		 */ 
			
			// Voer "$wishReceiver->register();" uit (method nog te maken in Person class)
			$_SESSION['content'] = $_SESSION['content']." ".(string)$wishReceiver."<br />Deze persoon heeft GEEN account.";
			
		} else {
			
			$_SESSION['content'] = $_SESSION['content']." ".(string)$wishReceiver."<br />Deze persoon heeft EEN account.";
			
		}
		
		// Next activity + save process instance info
		$_SESSION[$activityID] = "check creator is owner";
		
		// automatic activity --> refresh page immediately
		//header("Refresh: ".$activityRefreshRate);
		header("Refresh: 5");
		break;
		
	case 'check creator is owner':
		 /**
		 * ACT
		 * Check if the wish creator is also the wish owner?
		 */ 
		$frmID = "ask_creator_is_owner";
		include "./processes/forms/frm-".$frmID.".php";
		
		$_SESSION['content'] = $_SESSION['content']." ".$formHTML;
		
		// Next activity + save process instance info
		$_SESSION[$activityID] = "handle creator is owner respons";
		
		
		break;
		
	case 'handle creator is owner respons':	
		
		$frmID = "wishRegistration";
		
		$b_creatorIsOwner = false;
		if($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['frm'] == $frmID) {
			if(isset($_POST['CreatorIsOwner'])) 
			{
				$b_creatorIsOwner = true;
			}
			$b_creatorIsOwner = true;
		}
		
		// Next activity + save process instance info
		$_SESSION[$activityID] = "identificate wish creator";
		
		// automatic activity --> refresh page immediately
		header("Refresh: ".$activityRefreshRate);
		break;
		
	case 'identificate wish creator':
		 /**
		 * ACT
		 * Identificate wish creator
		 * (if creator is not the owner)
		 */ 
		
		// Next activity + save process instance info
		$_SESSION[$activityID] = "register a wish";
		
		// automatic activity --> refresh page immediately
		header("Refresh: ".$activityRefreshRate);
		break;
		
	case 'register a wish':
		 /**
		 * ACT
		 * Register a new wish
		 */
		 $wishReceiver = $_SESSION['wishReceiver'];
		 
		 $frmID = "register_wish";
		 include "./processes/forms/frm-".$frmID.".php";
		
		// Next activity + save process instance info
		 $_SESSION[$activityID] = "wish registered";
		 $_SESSION['content'] = $_SESSION['content']." ".$formHTML;
		
		 break;
	// case 'handle registered wish : 
	
	case 'wish registered':
		header("Refresh: ".$activityRefreshRate);
		
		// Next activity + save process instance info
		$_SESSION[$activityID] = "wish has been created";
		break;
	
	case 'wish has been created':
		$_SESSION['content'] = $_SESSION['content']." "."The wish is created.";
		session_destroy(); //**TEST
		break;
} // end of $activityState switch
?>