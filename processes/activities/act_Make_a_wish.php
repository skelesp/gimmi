<?php
require_once "/lib/GIMMI/Wish.php";
require_once "/lib/GIMMI/Person.php";

session_start();
/**
 * This activity will make it possible to create a wish.
 * 
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 15-nov-2015 15:51:14
 */

// Process variables
$activityID = 'p1_a1';
$activityRefreshRate = 1;
$output = "";

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
		include "processes/services/srv-Check_Wish_Owner.php";
		
		// Next activity + save process instance info
		$_SESSION[$activityID] = "ask for owner";	
		$_SESSION['o_Wish'] = $o_Wish;
		$_SESSION['b_ownerKnown'] = $b_ownerKnown;
		
		// automatic activity --> refresh page immediately
		header("Refresh: ".$activityRefreshRate);
		
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
			include "processes/forms/frm-".$frmID.".php";
			$output = $output." ".$formHTML;
			
			// Next activity + save process instance info
			$_SESSION[$activityID] = "handle owner info";
		}
		break;
		
	case 'handle owner info':
		$frmID = "wishOwner"; // get info from this form
		
		if($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['frm'] == $frmID) {
			// Store the form info in a Person object
			$o_Owner = new Person();
			
			$o_Owner->setlastName($_POST['owner_last']);
			$o_Owner->setfirstName($_POST['owner_first']);
			$o_Owner->setemail($_POST['owner_email']);
			
			$output = $output." ".$o_Owner;
			
			// Next activity + save process instance info
			$_SESSION['o_Owner'] = $o_Owner;
			$_SESSION[$activityID] = "check owner account";
			
		} else {
			$output = $output." "."Geen ownergegevens beschikbaar";
			
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
		$o_Owner = $_SESSION['o_Owner'];
		
		// Next activity + save process instance info
		$_SESSION[$activityID] = "create new account";
		$_SESSION['b_ownerHasAccount'] = $o_Owner->check_for_account();
		
		// automatic activity --> refresh page immediately
		//header("Refresh: ".$activityRefreshRate);
		header("Refresh: 5");
		break;
		
	case 'create new account':
		 /**
		 * DN
		 * Wish owner has an account?
		 */	
		$o_Owner = $_SESSION['o_Owner'];
		
		if (!$_SESSION['b_ownerHasAccount']) { /* owner doesn't have an account */
		/**
		 * ACT
		 * Create a new person account
		 */ 
			
			// Voer "$o_Owner->register();" uit (method nog te maken in Person class)
			$output = $output." ".(string)$o_Owner."<br />Deze persoon heeft GEEN account.";
			
		} else {
			
			$output = $output." ".(string)$o_Owner."<br />Deze persoon heeft EEN account.";
			
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
		include "/processes/forms/frm-".$frmID.".php";
		
		$output = $output." ".$formHTML;
		
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
		 $o_Owner = $_SESSION['o_Owner'];
		 
		 $frmID = "register_wish";
		 include "processes/forms/frm-".$frmID.".php";
		
		// Next activity + save process instance info
		 $_SESSION[$activityID] = "wish registered";
		 $output = $output." ".$formHTML;
		
		 break;
	
	case 'wish registered':
		$output = $output." "."The wish is registered.";
		header("Refresh: ".$activityRefreshRate);
		
		// Next activity + save process instance info
		session_destroy(); //**TEST
		break;
} // end of $activityState switch
?>