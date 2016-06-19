<?php

/**
 * The process class describes a process.
 
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 22-nov-2015 23:37:24
 */
class Element
{	
	protected $id; //@var ID of the process definition
	protected $name; //@var name of the process
	protected $type;
	protected $service;
	protected $procedure;
		
	public function __construct ($elementID) {
		
		// Get process info
		
		//TODO: Verwijder database code en plaats het in een DAO object --> Geen DB code in een class
		
		require './db_config.php';
		
		try 
		{ 
			$sQuery = " 
				SELECT 
					*
				FROM 
					process_elements
				WHERE
					elementID =".$elementID.""; 
			
			$oStmt = $db->prepare($sQuery); 
			$oStmt->execute(); 
					
			$results = $oStmt->fetch(PDO::FETCH_ASSOC);
			
			if (!empty($results)) {
				
				$this->id 			= $results["elementID"];
				$this->name 		= $results["name"];
				$this->type 	= $results["type"];
				$this->service 		= $results["serviceID"];
				$this->procedure 		= $results["procedureID"];
				
				$found = true;
			} else {
				//TODO: throw an error
				$found = false;
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
		
		return $found;
	}
	
	public function __toString () {
		return $this->type.": ".$this->name." (".$this->id.")";
	}
	
	public function getID () {
		return $this->id;
	}
	
	public function getName () {
		return $this->name;
	}
	
	public function getType () {
		return $this->type;
	}
	
}

?>