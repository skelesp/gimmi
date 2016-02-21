<?php

/**
 * ACT
 * Check if the wish owner is known
 */	
	$b_ownerKnown = false;
	$o_Owner = new Person();
	
	if ( isset($_SESSION['wishOwner']) && !empty($_SESSION['wishOwner']) ) {
		$b_ownerKnown = true;
		// laad het session object in het person object
	}
	
?>