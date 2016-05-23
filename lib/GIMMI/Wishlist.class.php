<?php
require_once ('./lib/GIMMI/Wish.class.php');
require_once ('./lib/GIMMI/Person.class.php');
/**
 * This class describes a wishlist that shows all the wishes a person has. The purpose of this wish is to
 * make clear to others what a person would like to receive.
 *
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 23-mei-2016 14:44:14
 */
class Wishlist
{
	private $receiver;
	private $wishes;
	
	
	//Magic Methods
	public function __construct($person){
		
		$this->receiver = $person;
		$this->wishes = array();
		
		//TODO: Verwijder database code en plaats het in een DAO object --> Geen DB code in een class
		require './db_config.php';
		
		try 
		{ 
			$sQuery = "
				SELECT 
					wishID, name, description, price, ownerID, creatorID
				FROM 
					wishes
				WHERE
					ownerID = ".$this->receiver->getID()
			; 
			
			$oStmt = $db->prepare($sQuery); 
			$oStmt->execute(); 
			 		
			$results = $oStmt->fetchAll(PDO::FETCH_ASSOC);
			
			if (! empty($results)){
				$this->wishes = $results;
				return true;
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
	
	
	//Accessors
	public function getWishes(){
		return $this->wishes;
	}
}
