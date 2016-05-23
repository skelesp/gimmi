<<?php
require_once "./lib/GIMMI/Wishlist.class.php";
require_once "./lib/GIMMI/Person.class.php";


/**
 * This activity will make it possible to create a wish.
 * 
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 15-nov-2015 15:51:14
 */

// Process variables
$activityID = 'Search_a_gift_idea_X';
$activityRefreshRate = 0;
$_SESSION['content'] = "";

// Check activity state
if ( !isset($_SESSION[$activityID]) || empty($_SESSION[$activityID]) ) {
	$activityState = 'start';
} else {
	$activityState = $_SESSION[$activityID];
}

unset($_SESSION[$activityID]);

auto: 
switch ($activityState) {
	case 'start':
		/**
		 * START
		 * Instantiate needed objects
		 */
			// no object to instantiate at this point
			//TODO: moet prereq check hier niet gebeuren?
		
		// Next activity + save process instance info
		$_SESSION[$activityID] = "wish owner known?";
		
		// automatic activity --> refresh page immediately
		header("Refresh: ".$activityRefreshRate);
		$_SESSION['DEBUG_message'] = $activityState." is starting...";
		break;
		
	case 'wish owner known?':
		/**
		 * DN
		 * Check whether the 'wish owner' is already known
		 */
		$_SESSION['DEBUG_message'] = $activityState." is running...";
		
		if ( !isset($_SESSION['wishReceiver']) || empty($_SESSION['wishReceiver']) ) {
			$_SESSION[$activityID] = "ask for wish owner";
			// automatic activity --> refresh page immediately
			header("Refresh: ".$activityRefreshRate);
			break;
			
		} else {
			// Next activity + save process instance info
			$_SESSION[$activityID] = "generate wishlist";
			
			// automatic activity --> refresh page immediately
			header("Refresh: ".$activityRefreshRate);
			break;
		}
		
	
	case 'ask for wish owner':
		$_SESSION['content'] = "Vraag naar de wish owner";
		$_SESSION['DEBUG_message'] = $activityState." is running...";
		break;
	
	case 'generate wishlist':
		 /**
		  * ACT
		  * Generate an array filled with wishes of a person
		  */
		$receiver = $_SESSION['wishReceiver'];
		$_SESSION['wishlist'] = new Wishlist ($receiver);
				
		// Next activity + save process instance info
		$_SESSION['DEBUG_message'] = $activityState." is running...";
		$_SESSION[$activityID] = "ask for wish selection";
				
	case 'ask for wish selection':
		
		$wishlist = $_SESSION['wishlist'];
		$person = $_SESSION['wishReceiver'];
		$text = "";
		$frmID = "wish_selection";
		
		$_SESSION['content'] = "Lijst van wensen voor ".$person->getName()."<br/><br/>";
		
		//TODO: kan onderstaande ook in een pfbc form gecreëerd worden?
		
		$text .= "<div class=\"wishlist\">";
		$text .= "<form method=\"POST\" action=\"\">";
		foreach ($wishlist->getWishes() as $wish){
			$text .= "<div class=\"wish\">";
			$text .= "<div class=\"name\">".$wish['name']."</div>";
			$text .= "<div class=\"price\">".$wish['price']."</div>";
			$text .= "<div class=\"select\"><input type=\"checkbox\" name=\"wish_selection[]\" value=\"".$wish['wishID']."\" /></div>";
			$text .= "</div>";
		}
		$text .= "<input type=\"hidden\" name=\"frm\" value=\"".$frmID."\" />";
		$text .= "<input type=\"submit\" value=\"Selectie klaar\" />";
		$text .= "</form>";
		$text .= "</div>";

		$_SESSION['content'] .= $text;
		
		// Next activity + save process instance info
		$_SESSION[$activityID] = "gift idea(s) selected?";
		$_SESSION['DEBUG_message'] = $activityState." is running...";
		break;
	
	case 'gift idea(s) selected?':
		//TODO: ontvang het resultaat van de form uit 'ask for wish selection'
		//TODO: controleer of er wishes geselecteerd zijn --> Ja : ga naar reservation / Nee : ga naar end (error)
		$frmID = "wish_selection";
		$ideaFound = false;
		
		if($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['frm'] == $frmID) {
			$selectedWishes = $_POST['wish_selection'];
			if ( !empty($selectedWishes) ){
				$ideaFound = true;
				$_SESSION['selectedIdeas'] = $selectedWishes;
			}
		}
		
		// Next activity + save process instance info
		switch($ideaFound){
			case true: 
				$_SESSION[$activityID] = "gift idea(s) found";
				break;
			case false:
				$_SESSION[$activityID] = "no gift idea found";
				break;
		}
		
		// automatic activity --> refresh page immediately
		header("Refresh: ".$activityRefreshRate);
		
		$_SESSION['DEBUG_message'] = $activityState." is running...";
		break;
		
	
	case 'gift idea(s) found':
		// END the activity
		$activityFinished = true;
		$_SESSION['DEBUG_message'] = $activityState;
		unset( $_SESSION[$activityID] );
				
		break;
	
	case 'no gift found':
		// END the activity
		$activityFinished = true;
		$_SESSION['DEBUG_message'] = $activityState;
		unset( $_SESSION[$activityID] );
				
		break;
	default:
		$_SESSION['DEBUG_message'] = $activityState." is no known activity";
		break;
}

?>