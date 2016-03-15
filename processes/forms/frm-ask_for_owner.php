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
	$frmName = "Wish Owner request";
	$frmID = "wishOwner";
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
	$form->addElement(new Element\HTML('<legend>Voor wie is de wens bedoeld?</legend>'));
	$form->addElement(new Element\HTML("<p><i>Vul een (of meerdere) van onderstaande gegevens in, aub.</p>"));
	// Hidden field with form name
	$form->addElement(new Element\Hidden("frm", $frmID));
	// Textfield for Wish Owner firstname
	$form->addElement(new Element\Textbox("Voornaam", "owner_first", array("required" => 0)));
	// Textfield for Wish Owner lastname
	$form->addElement(new Element\Textbox("Familienaam", "owner_last", array("required" => 0)));
	// Textfield for Wish Owner email
	$form->addElement(new Element\Email("Emailadres", "owner_email", array("required" => 0)));
	// Textfield for Wish Owner nickname
	$form->addElement(new Element\Textbox("Nickname", "owner_nick"));
	// Button to send the form
	$form->addElement(new Element\Button("Verder", "submit", array("name" => $frmID)));

// Render the form with all its elements
	$formHTML = $form->render(true);
	
?>