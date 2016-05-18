<?php
require_once "./lib/GIMMI/Person.class.php";
require_once "./lib/GIMMI/User.class.php";

/**
 * This activity will make it possible to create a wish.
 * 
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 15-nov-2015 15:51:14
 */

 // Process variables
$activityID = 'authenticate_a_user_XX';
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
		
			// no object to instantiate at this point
			//TODO: moet prereq check hier niet gebeuren?
		
		// Next activity + save process instance info
		$_SESSION[$activityID] = "check cookies";
		
		// automatic activity --> refresh page immediately
		$_SESSION['content'] = $activityState." is starting...";
		header("Refresh: ".$activityRefreshRate);
		
		break;
	
	case 'check cookies':
		/**
		 * ACT
		 * Check cookies
		*/
				
		// Check if user is stored in cookies
		$_SESSION['cookiesAvailable?'] = false; 
			/* TODO: cookies functionaliteit nog niet beschikbaar
			 * Toevoegen decision "cookies found" als dit wordt geïmplementeerd
			 */
		
		// automatic activity --> refresh page immediately
		$_SESSION[$activityID] = "ask user credentials";
		$_SESSION['content'] = $activityState." is starting...";
		header("Refresh: ".$activityRefreshRate);
				
		break;
	
	case 'ask user credentials':
		/**
		* ACT
		* Ask user credentials
		*/
		 
		// Form variables
		$frmID = "user_credentials";
		include "./processes/forms/frm-".$frmID.".php";

		// Next activity + save process instance info
		$_SESSION[$activityID] = "verify user credentials";
		$_SESSION['content'] = $_SESSION['content']." ".$formHTML;
		
		break;
	
	case 'verify user credentials':
		/**
		 * ACT
		 * Verify user credentials
		 */
		
		$frmID = "user_credentials"; // get info from this form
		
		if($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['frm'] == $frmID) {
			// Create a User object with the form info
			$user = new User($_POST['login_user'], $_POST['login_password'] );
			echo var_export ($user);
			$user->authenticate();
			
			unset( $_SESSION['pfbc'] );
			
			// Next activity + save process instance info
			$_SESSION['authenticatingUser'] = $user;
			$_SESSION[$activityID] = "user known?";
			
		} else { //Geen ownergegevens beschikbaar in form var --> Is deze loop nodig? In principe gaan we hier altijd input krijgen!!
			
			// Next activity + save process instance info
			$_SESSION[$activityID] = "ask user credentials";
			
		}

		// automatic activity --> refresh page immediately
		$_SESSION['content'] = $activityState." is loading...";
		header("Refresh: ".$activityRefreshRate);
		
		break;
	
	case 'user known?':
		 /**
		 * DN
		 * User known?
		 */	
		$user = $_SESSION['authenticatingUser'];
		
		if ( $user->isAuthenticated() ) { /* YES : user is authenticated*/
			// Next activity
			$_SESSION[$activityID] = "load user in session";
			
		} else { /*NO*/
			// Next activity
			$_SESSION[$activityID] = "ask user credentials";
			
		}
		
		// automatic activity --> refresh page immediately
		$_SESSION['content'] = $activityState." is loading...";
		
		header("Refresh: ".$activityRefreshRate);
		
		break;
	
	case 'load user in session':
		/**
		 * ACT
		 * Load user in session
		 */
		 
		$user = $_SESSION['authenticatingUser'];
		// TODO: toevoegen $user->loadPerson(); method in User class om de nodige info op te halen ivm een user (enkel als hij 'authenticated' is)
		$_SESSION['user'] = $user;
		unset ( $_SESSION['authenticatingUser'] );
		
		// automatic activity --> refresh page immediately
		$_SESSION['content'] = $activityState." is loading...";
		$_SESSION[$activityID] = "user is authenticated";
		
		header("Refresh: ".$activityRefreshRate);
		
		break;
		
	case 'user is authenticated':
		/**
		 * END
		 * User is authenticated
		 */
		
		// Finish activity + delete temporary process instance info
		$activityState = "END";
		header("Location: ./index.php"); // return to 'portal'
		unset( $_SESSION[$activityID] );
		unset( $_SESSION['authenticatingUser'] );
		unset( $_SESSION['cookiesAvailable?'] );
		unset( $_SESSION['person_authenticated?'] );
		$_SESSION['content'] = $_SESSION['content']." "."You are logged in"; // TODO: onderstaande zou een 'message' moeten zijn (message functionaliteit nog te ontwikkelen)
		
		break;
		
	default:
		$_SESSION['content'] = "Service '".$activityState."' not found";
		unset( $_SESSION[$activityID] );
		
} // end of $activityState switch

//DEBUG: $_SESSION['content'] = "activiteitsstatus : ".$activityState."<br/>".$_SESSION['content'];

?>