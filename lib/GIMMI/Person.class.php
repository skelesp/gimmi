<?php

/**
 * The person class describes a human being.
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 18-okt-2015 18:35:27
 */
class Person
{

// Properties

	private $firstName;
	private $lastName;
	private $email;
	private $nickname;
	private $subscribed;
	private $type; //TODO: Verwijder deze variabele! --> moet vervangen worden door Giver en Receiver classes!

// Magic Methods

	function __construct($type)
	{
		$this->type = $type;
	}

	function __destruct()
	{
	}
	
	function __toString(){
		$text = $this->firstName." ".$this->lastName." can be reached on ".$this->email;
		if (!empty($this->nickname)){
			$text = $text."and you can call him/her '".$this->nickname."'";
		}
		$text = $text.".";
		return $text;
	}
	
// Accessors
	
	public function getlastName()
	{
		return $this->lastName;
	}

	/**
	 * 
	 * @param newVal
	 */
	public function setlastName($newVal)
	{
		$this->lastName = $newVal;
	}

	public function getfirstName()
	{
		return $this->firstName;
	}
	
	public function isSubscribed(){
		return $this->subscribed;
	}
	/**
	 * 
	 * @param newVal
	 */
	public function setfirstName($newVal)
	{
		$this->firstName = $newVal;
	}

	public function getemail()
	{
		return $this->email;
	}
	/**
	 * 
	 * @param newVal
	 */
	public function setemail($newVal)
	{
		$this->email = $newVal;
	}

// Methods
	public function register () {
		/* In de echte register method moet onderstaande niet staan!
		Register moet de opdracht zijn om de gegevens in de class te registreren.
		Register controleer of de persoon al gekend is in de database.
		Register maakt nieuwe record in database indien nodig.
		*/
		switch ($this->type) { //TODO: verwijder deze switch als class Receiver en Giver aangemaakt zijn
				case 'Giver':
				case 'User':
					$frmID = "user_credentials";
					break;
				case 'Receiver':
					$frmID = "register_person";
					break;
				default:
					$frmID = "register_person";
					break;
		}
		
		if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['frm'] == $frmID) {
			
			$this->setlastName($_POST['person_last']);
			$this->setfirstName($_POST['person_first']);
			$this->setemail($_POST['person_email']);
						
			switch ($this->type) {//TODO: verwijder deze switch als class Receiver en Giver aangemaakt zijn
				case 'Giver': 
					$_SESSION['user'] = $this;
					break;
				case 'Receiver':
					$_SESSION['wishReceiver'] = $this;
					break;
			}
			
			return 1;
			
		} else {
			switch ($this->type) { //TODO: verwijder deze switch als class Receiver en Giver aangemaakt zijn
				case 'Giver':
				case 'User':
					$legend = "Gelieve uw gegevens in te vullen. (login)";
					include"./processes/forms/frm-".$frmID.".php";
					break;	
					
				case 'Receiver': 
					$legend = "Voor wie is het cadeau idee?";
					include"./processes/forms/frm-register_person.php";
					break;
					
				default : 
					$legend = "Gelieve de persoonsgegevens op te geven.";
					include"./processes/forms/frm-register_person.php";
					break;
			}
			return $formHTML;
			
		}
	}
	
	public function check_for_account () {
		require './db_config.php';
		//TODO: Verwijder database code en plaats het in een DAO object --> Geen DB code in een class
		try 
		{ 
			$sQuery = " 
				SELECT 
					*
				FROM 
					persons
				WHERE
					email LIKE '".$this->email."'"; 
			 
			$oStmt = $db->prepare($sQuery); 
			$oStmt->execute(); 
			 
			 
			// EXTRA UITLEG
			// Tot aan de while-loop zal alles je redelijk bekend voorkomen. Wat we in de while loop doen is de PDO variant van mysql_fetch_assoc(). Met behulp van de fetch() methode kunnen we rij voor rij uit de resultaat set fetchen. Door de constante PDO::FETCH_ASSOC mee te geven, is het resultaat een associatieve array waarin de kolomnamen de keys vormen.

			// Wat opvalt is dat PDO geen functie als mysql_num_rows() kent en we dus niet zomaar kunnen zien of er records in de resultaat set zitten. Om toch het aantal rijen dat opgehaald wordt te bepalen zouden we eerste een SELECT query met COUNT() uit kunnen voeren. Een andere manier is alle resultaten eerst met de fetchAll() methode in een array te zetten en vervolgens de PHP functie count() te gebruiken.
			// END - EXTRA UITLEG
			
			$results = $oStmt->fetch(PDO::FETCH_ASSOC);
			
			if (empty($results)){
				$this->subscribed = false;
			} else {
				$this->subscribed = true;
			}
		} 
		catch(PDOException $e) 
		{ 
			$sMsg = '<p> 
					Regelnummer: '.$e->getLine().'<br /> 
					Bestand: '.$e->getFile().'<br /> 
					Foutmelding: '.$e->getMessage().'<br />
					Query: '.$sQuery.'
				</p>'; 
			 
			trigger_error($sMsg); 
		} 
	}
}
?>