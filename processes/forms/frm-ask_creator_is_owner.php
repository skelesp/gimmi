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
	$frmName = "Wish creator is wish owner";
	$frmID = "wishCreatorIsOwner";
	$form = new Form($frmName);

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
	$form->addElement(new Element\HTML('<legend>Ben jij degene waarvoor de wens bestemd is?</legend>'));
	// Hidden field with form name
	$form->addElement(new Element\Hidden("frm", $frmID));
	// Checkbox "wish for myself"
	$form->addElement(new Element\Checkbox("", "CreatorIsOwner", array("ja" => "Ja, ik ben het.")));
	// Button to send the form
	$form->addElement(new Element\Button("Verder", "submit", array("name" => $frmID)));

// Render the form with all its elements
	$formHTML = $form->render(true);
	
?>