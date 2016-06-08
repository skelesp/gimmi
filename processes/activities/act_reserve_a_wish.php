<?php
require_once "./lib/GIMMI/Wishlist.class.php";
require_once "./lib/GIMMI/Wish.class.php";
require_once "./lib/GIMMI/Person.class.php";
require_once "./lib/GIMMI/User.class.php";

/**
 * This activity will make it possible to reserve a gift.
 * 
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 15-nov-2015 15:51:14
 */

// Process variables
$activityID = 'Reserve_a_gift_X';
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
		$chosenWishes = array();
		
		foreach ($_SESSION['selectedWishes'] as $wishID) {
			$wish = new Wish($wishID);
			$chosenWishes[] = $wish;
		};
		
		$_SESSION['chosenWishes'] = $chosenWishes;
				
		// Next activity + save process instance info
		$_SESSION[$activityID] = "Ask to reserve a gift";
		
		// automatic activity --> refresh page immediately
		$_SESSION['content'] = $activityState." is starting...";
		header("Refresh: ".$activityRefreshRate); 
		$_SESSION['DEBUG_message'] = $activityState." is running...";
		
		break;
	
	case 'Ask to reserve a gift':
		/**
		* ACT
		* Ask to reserve a gift
		*/
		
		$user = $_SESSION['user'];
		$wishReceiver = $_SESSION['wishReceiver'];
		$chosenWishes= $_SESSION['chosenWishes'];
		
		// Form variables
		$frmID = "gift_reservation";
		
		//TODO: kan onderstaande ook in een pfbc form gecreëerd worden?
		$text = "";
		$text .= "<div class=\"wishlist\">";
		$text .= "<form method=\"POST\" action=\"\">";
		foreach ($chosenWishes as $wish){
			$text .= "<div class=\"wish\">";
			$text .= "<div class=\"name\">".$wish->getName()."</div>";
			$text .= "<div class=\"price\">".$wish->getPrice()."</div>";
			$text .= "<div class=\"select\"><input type=\"checkbox\" name=\"wish_selection[]\" value=\"".$wish->getID()."\" /></div>";
			$text .= "</div>";
		}
		$text .= "<input type=\"hidden\" name=\"frm\" value=\"".$frmID."\" />";
		$text .= "<input type=\"submit\" value=\"Selectie klaar\" />";
		$text .= "</form>";
		$text .= "</div>";
		
		$_SESSION['content'] .= "FORM TEST".$text;
		
		// Next activity + save process instance info
		$_SESSION['DEBUG_message'] = $activityState." is running...";
		$_SESSION[$activityID] = "Gift ideas reserved?";
				
		break;
		
	case 'Gift ideas reserved?':
		//TODO: controle toevoegen
		
		
		// Next activity + save process instance info
		$_SESSION['DEBUG_message'] = $activityState." is running...";
		header("Refresh: ".$activityRefreshRate); 
		$_SESSION[$activityID] = "gift reserved";
		
		break;
		
	case 'gift reserved':
		// END the activity
		$activityFinished = true;
		$_SESSION['DEBUG_message'] = $activityState;
		unset( $_SESSION[$activityID] );
				
		break;
	default:
		$_SESSION['DEBUG_message'] = $activityState." is no known activity";
		unset( $_SESSION[$activityID] );
		break;
}