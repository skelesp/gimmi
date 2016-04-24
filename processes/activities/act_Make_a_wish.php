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
$activityID = 'make_a_wish_1';
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
		$_SESSION[$activityID] = "register a wish";
		
		// automatic activity --> refresh page immediately
		$_SESSION['content'] = $activityState." is starting...";
		header("Refresh: ".$activityRefreshRate);
		break;
		
	// case 'check owner':
		// /**
		 // * ACT
		 // * Check if the wish owner is known
		 // */
		// $o_Wish = $_SESSION['o_Wish'];
		// include "./processes/services/srv-Check_Wish_Owner.php";
		
		// // Next activity + save process instance info
		// $_SESSION[$activityID] = "ask for owner";	
		// $_SESSION['o_Wish'] = $o_Wish;
		// $_SESSION['b_ownerKnown'] = $b_ownerKnown;
		
		// // automatic activity --> refresh page immediately
		// $_SESSION['content'] = $activityState." is loading...";
		// header("Refresh: ".$activityRefreshRate);
		
		// break;		
	
	// case 'ask for owner':
		// /**
		 // * DN
		 // * Is the wish owner known?
		 // */	
		// if (!$_SESSION['b_ownerKnown']){ /* Owner is not known */	
			// /**
			 // * ACT
			 // * Ask for wish owner
			 // */
			// $frmID = "ask_for_owner";
			// include "./processes/forms/frm-".$frmID.".php";
			// $_SESSION['content'] = $_SESSION['content']." ".$formHTML;
			
			// // Next activity + save process instance info
			// $_SESSION[$activityID] = "handle owner info";
			
		// } else {
			
			// $_SESSION[$activityID] = "check owner account";
			// // automatic activity --> refresh page immediately
			// $_SESSION['content'] = $activityState." is loading... (".!$_SESSION['b_ownerKnown'].")";
			// header("Refresh: ".$activityRefreshRate);
			
		// }
		
		// break;
		
	// case 'handle owner info':
		// $frmID = "wishOwner"; // get info from this form
		
		// if($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['frm'] == $frmID) {
			// // Store the form info in a Person object
			// $wishReceiver = new Person('Receiver');
			
			// $wishReceiver->setlastName($_POST['owner_last']);
			// $wishReceiver->setfirstName($_POST['owner_first']);
			// $wishReceiver->setemail($_POST['owner_email']);
			
			// $_SESSION['content'] = $_SESSION['content']." ".$wishReceiver;
			
			// // Next activity + save process instance info
			// $_SESSION['wishReceiver'] = $wishReceiver;
			// $_SESSION[$activityID] = "check owner account";
			
		// } else { //Geen ownergegevens beschikbaar in form var
			
			// // Next activity + save process instance info
			// $_SESSION[$activityID] = "ask for owner";
			
		// }
		// // automatic activity --> refresh page immediately
		// $_SESSION['content'] = $activityState." is loading...";
		// header("Refresh: ".$activityRefreshRate);
		// break;
		
	// case 'check owner account':
		// /**
		 // * ACT
		 // * Check if there is an account which corresponds to the given data
		 // */
		// $wishReceiver = $_SESSION['wishReceiver'];
		
		// // Next activity + save process instance info
		// $_SESSION[$activityID] = "create new account";
		// $wishReceiver->check_for_account();
		
		// $_SESSION['wishReceiver'] = $wishReceiver;
	
		// // automatic activity --> refresh page immediately
		// $_SESSION['content'] = $activityState." is loading...";
		// header("Refresh: ".$activityRefreshRate);
		// break;
		
	// case 'create new account':
		 // /**
		 // * DN
		 // * Wish owner has an account?
		 // */	
		// $wishReceiver = $_SESSION['wishReceiver'];
		
		// if (!$wishReceiver->isSubscribed()) { /* owner doesn't have an account */
		// /**
		 // * ACT
		 // * Create a new person account
		 // */ 
			
			// // Voer "$wishReceiver->register();" uit (method nog te maken in Person class)
			// $_SESSION['content'] = $_SESSION['content']." ".(string)$wishReceiver."<br />Deze persoon heeft GEEN account.";
			
		// } else {
			
			// $_SESSION['content'] = $_SESSION['content']." ".(string)$wishReceiver."<br />Deze persoon heeft EEN account.";
			
		// }
		
		// // Next activity + save process instance info
		// $_SESSION[$activityID] = "check creator is owner";
		
		// // automatic activity --> refresh page immediately
		// $_SESSION['content'] = $activityState." is loading...";
		// header("Refresh: ".$activityRefreshRate);
		// break;
		
	// case 'check creator is owner':
		 // /**
		 // * ACT
		 // * Check if the wish creator is also the wish owner?
		 // */ 
		// $frmID = "ask_creator_is_owner";
		// include "./processes/forms/frm-".$frmID.".php";
		
		// $_SESSION['content'] = $_SESSION['content']." ".$formHTML;
		
		// // Next activity + save process instance info
		// $_SESSION[$activityID] = "handle creator is owner respons";
		
		
		// break;
		
	// case 'handle creator is owner respons':	
		
		// $frmID = "wishRegistration";
		
		// $b_creatorIsOwner = false;
		// if($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['frm'] == $frmID) {
			// if(isset($_POST['CreatorIsOwner'])) 
			// {
				// $b_creatorIsOwner = true;
			// }
			// $b_creatorIsOwner = true;
		// }
		// $_SESSION['content'] = $activityState." is loading...";
		// // Next activity + save process instance info
		// $_SESSION[$activityID] = "register a wish";
		
		// // automatic activity --> refresh page immediately
		// $_SESSION['content'] = $activityState." is loading...";
		// header("Refresh: ".$activityRefreshRate);
		// break;
		
	case 'register a wish':
		 /**
		 * ACT
		 * Register a new wish
		 */
		 $giver = $_SESSION['user'];
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
		$activityState = "END";
		header("Location: ./index.php");
		unset( $_SESSION[$activityID] );
		unset( $_SESSION['wishReceiver'] );
		unset( $_SESSION['b_ownerKnown'] );
		$_SESSION['content'] = $_SESSION['content']." "."The wish is created.";
		break;
	default:
		$_SESSION['content'] = "Service '".$activityState."' not found";
		unset( $_SESSION[$activityID] );
} // end of $activityState switch

//DEBUG: $_SESSION['content'] = "activiteitsstatus : ".$activityState."<br/>".$_SESSION['content'];
?>