<?php
require_once "./lib/GIMMI/Wishlist.class.php";
require_once "./lib/GIMMI/Person.class.php";
require_once "./lib/GIMMI/PersonRepository.class.php";


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

switch ($activityState) {
	case 'start':
		/**
		 * START
		 * Instantiate needed objects
		 */
			// no object to instantiate at this point
			//TODO: moet prereq check hier niet gebeuren?
			unset($_SESSION['wishReceiver']);
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
		 
		 $frmID = "register_person";
		 $legend = "Voor wie wilt u een cadeau zoeken?";
		 include "./processes/forms/frm-".$frmID.".php";
		
		// Next activity + save process instance info
		 $_SESSION[$activityID] = "search a wish owner";
		 $_SESSION['content'] = $_SESSION['content']." ".$formHTML;
		
		$_SESSION['DEBUG_message'] = $activityState." is running...";
		break;
		
	case 'search a wish owner':
		$_SESSION['DEBUG_message'] = $activityState." is running...";
		
		$frmID = "register_person";
		if($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['frm'] == $frmID) {
			
			$_SESSION['content'] = $_POST['person_first']."<br/>".$_POST['person_last']."<br/>".$_POST['person_email'];
			$repo = new PersonRepository ();
			$persons = $repo->findPerson($_POST['person_email'],$_POST['person_first'], $_POST['person_last']);
		}
		
		// Next activity + save process instance info
		$_SESSION[$activityID] = "wishlist owner found?";
		$_SESSION['foundWishlistOwners'] = $persons;
		
		// automatic activity --> refresh page immediately
		header("Refresh: ".$activityRefreshRate);
		break;
		
	case 'wishlist owner found?':
		$persons = $_SESSION['foundWishlistOwners'];
		
		if(count($persons) == 0 ){ // geen persoon gevonden
			
			//TODO: Foutboodschap meegeven
			
			// Next activity + save process instance info
			$_SESSION[$activityID] = "trigger person registration";
			
			// automatic activity --> refresh page immediately
			header("Refresh: ".$activityRefreshRate);
			
		} elseif (count($persons) == 1 ){ // exact 1 persoon gevonden
			
			$person = new Person ($persons[0]['email']);
			$_SESSION['wishReceiver'] = $person;
			
			// Next activity + save process instance info
			 $_SESSION[$activityID] = "generate wishlist";
			
			// automatic activity --> refresh page immediately
			header("Refresh: ".$activityRefreshRate);
			
		} else { // meer dan 1 persoon gevonden die voldeed aan de gegevens
			
			//TODO: toon een lijst van alle gevonden personen en laat de gebruiker selecteren wie het is
		
		}
		$_SESSION['DEBUG_message'] = $activityState." is running...";
		break;
	
	case 'trigger person registration':
		// Next activity + save process instance info
		$_SESSION['DEBUG_message'] = $activityState." is running...";
		$_SESSION[$activityID] = "ask for wish selection";
		
		// automatic activity --> refresh page immediately
		//header("Refresh: ".$activityRefreshRate);
		
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
		
		$frmID = "wish_selection";
		$ideaFound = false;
		
		if($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['frm'] == $frmID) {
			if ( !empty($_POST['wish_selection']) ){
				$selectedWishes = $_POST['wish_selection'];
				$ideaFound = true;
				$_SESSION['selectedWishes'] = $selectedWishes;
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
	
	case 'no gift idea found':
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