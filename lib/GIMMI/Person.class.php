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

	private $id;
	private $firstName;
	private $lastName;
	private $email;
	private $nickname;
	private $subscribed;
	private $type; //TODO: Verwijder deze variabele! --> moet vervangen worden door Giver en Receiver classes!

// Magic Methods

	public function __construct($email = null, $login = null, $type = "User")
	{
		$key = null;
		
		// If email was given in constructor: construct with email
		if ( !empty($email) ) {
			$key = "email";
		}
		
		if ( !empty($login) ) {
			$key = "login";
		}
		// TODO: verwijder $type uit Person class
		$this->type = $type;
		
		//TODO: Verwijder database code en plaats het in een DAO object --> Geen DB code in een class
		
		require './db_config.php';
		
		try 
		{ 
			$sQuery = " 
				SELECT 
					*
				FROM 
					persons
				WHERE
					".$key." LIKE '".$$key."'"; 
			
			$oStmt = $db->prepare($sQuery); 
			$oStmt->execute(); 
					
			$results = $oStmt->fetch(PDO::FETCH_ASSOC);
			
			if (!empty($results)) {
				
				$this->id = $results["personID"];
				$this->firstName = $results["firstName"];
				$this->lastName = $results["lastName"];
				$this->email = $results["email"];
				$this->nickname = $results["nickname"];
				
				return true;
			} else {
				//TODO: throw an error
				return false;
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

	function __destruct()
	{
	}
	
	function __toString(){
		$text = $this->firstName." ".$this->lastName." can be reached on ".$this->email;
		if (!empty($this->nickname)){
			$text = $text." and you can call him/her '".$this->nickname."'";
		}
		$text = $text.".";
		return $text;
	}
	
// Accessors

	public function getID(){
		return $this->id;
	}
	
	public function getlastName()
	{
		return $this->lastName;
	}

	/**
	 * 
	 * @param newVal
	 */
	public function getName(){
		return $this->firstName." ".$this->lastName;
	}
	
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
		
	}
	
	public function isSamePersonAs($person) {
		if ($this->email == $person->getEmail() && $this->id == $person->getID()) {
			return true;
		} else {
			return true;
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