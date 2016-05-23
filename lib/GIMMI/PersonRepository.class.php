<?php

/**
 * The person class describes a human being.
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 18-okt-2015 18:35:27
 */
class PersonRepository
{
	
	//Magic Methods
	public function __construct(){
	}
	
	//Accessors
	
	//Methods
	public function findPerson($email = null, $firstName = null, $lastName = null){
		//TODO: Verwijder database code en plaats het in een DAO object --> Geen DB code in een class
		
		require './db_config.php';
		
		try 
		{ 
			$sQuery = " 
				SELECT 
					*
				FROM 
					persons
				WHERE";
			$orNeeded = false;
			if (!empty($email)) {
				$sQuery .= " email LIKE '".$email."'";
				$orNeeded = true;
			}
			if (!empty($firstName)) {
				if ($orNeeded) {
					$sQuery .= " OR ";
				}
				$sQuery .= " firstName LIKE '".$firstName."'";
				$orNeeded = true;
			}
			if (!empty($lastName)) {
				if ($orNeeded) {
					$sQuery .= " OR ";
				}
				$sQuery .= " lastName LIKE '".$lastName."'";
				$orNeeded = true;
			}
			
			$oStmt = $db->prepare($sQuery); 
			$oStmt->execute(); 
			 		
			$results = $oStmt->fetchAll(PDO::FETCH_ASSOC);
			
			if (empty($results)){
				return false;
			} else {
				return $results;
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