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
	$frmName = "Input a person";
	//$frmID = "input_person";
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
	$form->addElement(new Element\HTML("<legend>".$legend."</legend>"));
	// Hidden field with form name
	$form->addElement(new Element\Hidden("frm", $frmID));
	// Text field for Wish Title
	$form->addElement(new Element\Textbox("Voornaam", "person_first"));
	// Textarea for Wish Description
	$form->addElement(new Element\Textbox("Familienaam", "person_last"));
	// Number field for Wish Price Range
	$form->addElement(new Element\Textbox("Email", "person_email"));
	// Button to send the form
	$form->addElement(new Element\Button("Registreer", "submit", array("name" => $frmID)));

// Render the form with all its elements
	$formHTML = $form->render(true);
	
?>