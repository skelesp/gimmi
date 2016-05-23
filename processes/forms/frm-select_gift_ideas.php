<?php

use PFBC\Form;
use PFBC\Element;
use PFBC\View;

include_once "./lib/PFBC/form.php";

/**
 * This form will ask for the name of the wish owner.
 * 
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 15-nov-2015 16:29:14
 */

 // Create a new form with name "Wish Owner?"
	$frmID = "wishSelection";
	$form = new Form($frmID);

// Configure the form
// No action required, method POST, vertical view
	$form->configure(array(
		"action" => "",
		"method" => "POST",
		"labelToPlaceholder" => 0,
		"view" => new View\SideBySide
		));
		
// Create form elements
	// Add form title
	$legend = "<legend>Lijst van wensen voor ".$person->getName()."</legend>";
	
	$form->addElement(new Element\HTML($legend));
	// Hidden field with form name
	$form->addElement(new Element\Hidden("frm", $frmID));
	// Checkboxes for wish selection	
		
		foreach ($wishlist->getWishes() as $wish){
			$wish['name']."</div>";
			$text .= "<div class=\"price\">".$wish['price']."</div>";
			$text .= "</div>";
		}
		$text .= "</div>";

	
	$form->addElement(new Element\Checkbox("Checkboxes:", "Checkboxes", $options));
	
	// Button to send the form
	$form->addElement(new Element\Button("Registreer", "submit", array("name" => $frmID)));

// Render the form with all its elements
	$formHTML = $form->render(true);
	
?>