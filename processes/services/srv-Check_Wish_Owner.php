<?php

/**
 * ACT
 * Check if the wish owner is known
 */	
	$b_ownerKnown = false;
	$o_Owner = new Person('Receiver');
	
	if ( isset($_SESSION['wishReceiver']) && !empty($_SESSION['wishReceiver']) ) {
		$b_ownerKnown = true;
		// laad het session object in het person object
		$o_Owner = $_SESSION['wishReceiver'];
	}
	
?>