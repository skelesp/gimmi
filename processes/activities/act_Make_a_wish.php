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
$activityID = 'make_a_wish_X';
$activityRefreshRate = 0;
$_SESSION['content'] = "";

// Check activity state
if ( !isset($_SESSION[$activityID]) || empty($_SESSION[$activityID]) ) {
	$activityState = 'start';
} else {
	$activityState = $_SESSION[$activityID];
}

unset($_SESSION[$activityID]);

switch ($activityState) {
	case 'start':
		/**
		 * START
		 * Instantiate new Wish object with default name
		 */
			// no object to instantiate at this point
			//TODO: moet prereq check hier niet gebeuren?
		
		// Next activity + save process instance info
		$_SESSION[$activityID] = "ask for wish details";
		
		// automatic activity --> refresh page immediately
		header("Refresh: ".$activityRefreshRate);
		$_SESSION['content'] = $activityState." is starting...";
		break;
				
	case 'ask for wish details':
		 /**
		 * ACT
		 * Register a new wish
		 */
		 $giver = $_SESSION['user'];
		 $wishReceiver = $_SESSION['wishReceiver'];
		 
		 $frmID = "register_wish";
		 include "./processes/forms/frm-".$frmID.".php";
		
		// Next activity + save process instance info
		 $_SESSION[$activityID] = "handle wish registration";
		 $_SESSION['content'] = $_SESSION['content']." ".$formHTML;
		
		 break;
	// case 'handle registered wish : 
	
	case 'handle wish registration':
		$frmID = "wishRegistration"; // get info from this form
		
		$_SESSION['content'] = $activityState." is loading...";
		
		if($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['frm'] == $frmID) {
			// Store the form info in a Wish object
			$wish = new Wish();
			
			$wish->setName($_POST['wish_title']);
			$wish->setDescription($_POST['wish_description']);
			$wish->setPrice($_POST['wish_price']);
			if ( is_array($_POST['wish_private'])) {
				$wish->setPrivate(true);
			} else {
				$wish->setPrivate(false);
			}
			
			$wish->register();
			
			// Next activity + save process instance info
			$_SESSION[$activityID] = "wish registered";
			
		} else { //Geen formgegevens beschikbaar in form var
			
			// Next activity + save process instance info
			$_SESSION[$activityID] = "ask for wish details";
			
		}
		// automatic activity --> refresh page immediately
		
		header("Refresh: ".$activityRefreshRate);
		break;
	
	case 'wish registered':
		// END the activity
		$activityFinished = true;
		$_SESSION['content'] = $activityState." is done...";
		unset( $_SESSION[$activityID] );
		unset( $_SESSION['wishReceiver'] );
		unset( $_SESSION['b_ownerKnown'] );
		
		break;
		
	default:
		$_SESSION['content'] = "Service '".$activityState."' not found";
		unset( $_SESSION[$activityID] );
} // end of $activityState switch

?>