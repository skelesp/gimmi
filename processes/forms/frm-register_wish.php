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

 // Calling activity
 $callingActivity = "act_Make_a_wish.php";
  
 // Create a new form with name "Wish Owner?"
	$frmName = "Wish registration";
	$frmID = "wishRegistration";
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
	$form->addElement(new Element\HTML('<legend>'.$giver->getfirstname().': Wat wil je wensen voor '.$wishReceiver->getfirstName()." ".$wishReceiver->getlastName().'?</legend>'));
	// Hidden field with form name
	$form->addElement(new Element\Hidden("frm", $frmID));
	// Text field for Wish Title
	$form->addElement(new Element\Textbox("Titel", "wish_title"));
	// Textarea for Wish Description
	$form->addElement(new Element\Textarea("Beschrijving", "wish_description"));
	// Number field for Wish Price Range
	$form->addElement(new Element\Number("Prijsschatting (in euro)", "wish_price", array("style" => "height: 30px;")));
	// Checkbox for Wish privacy
	$form->addElement(new Element\Checkbox("", "Wish_private", array("ja" => "Deze wens niet zichtbaar maken voor ".$wishReceiver->getfirstName()."?")));
	// Button to send the form
	$form->addElement(new Element\Button("Registreer", "submit", array("name" => $frmID)));

// Render the form with all its elements
	$formHTML = $form->render(true);
	
?>