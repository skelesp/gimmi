<?php

use PFBC\Form;
use PFBC\Element;
use PFBC\View;

include_once "./lib/PFBC/form.php";

/**
 * This form will ask for info about a person.
 * 
 * @author Stijn Beeckmans
 * @version 0.2
 * @created 15-nov-2015 16:29:14
 */

 // Create a new form to register a person"
	$form = new Form($frmID);
	$legend = "Geef uw logingegevens";
	$formHTML = "";

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
	$form->addElement(new Element\Textbox("User", "login_user"));
	// Textarea for Wish Description
	$form->addElement(new Element\Password("Password", "login_password"));
	// Button to send the form
	$form->addElement(new Element\Button("Login", "submit", array("name" => $frmID)));

// Render the form with all its elements
	$formHTML = $form->render(true);
	
?>