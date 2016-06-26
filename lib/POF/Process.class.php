<?php

require_once "./lib/POF/ElementDefinition.class.php";

/**
 * The process class describes a process.
 
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 22-nov-2015 23:37:24
 */
class Process
{	
	protected $id; //@var ID of the process definition
	protected $name; //@var name of the process
	private $description;
	protected $prerequisites; //@var array of prerequisites to be able to start the process
	protected $elements;
	private $status;
	protected $owner;
	protected $trigger; //TODO : class uitbreiden, zodat meerdere triggers mogelijk zijn.
		
	public function __construct ($processID) {
		
		// Get process info
		
		//TODO: Verwijder database code en plaats het in een DAO object --> Geen DB code in een class
		
		require './db_config.php';
		
		try 
		{ 
			$sQuery = " 
				SELECT 
					*
				FROM 
					process_definitions
				WHERE
					processID =".$processID.""; 
			
			$oStmt = $db->prepare($sQuery); 
			$oStmt->execute(); 
					
			$results = $oStmt->fetch(PDO::FETCH_ASSOC);
			
			if (!empty($results)) {
				
				$this->id 			= $results["processID"];
				$this->name 		= $results["name"];
				$this->description 	= $results["description"];
				$this->status 		= $results["status"];
				$this->owner 		= $results["owner"];
				
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
		
		// Get process elements
		$results = null;
		try 
		{ 
			$sQuery = " 
				SELECT 
					elementID, nextElementID
				FROM 
					process_structure
				WHERE
					processID = ".$processID; 
			$oStmt = $db->prepare($sQuery); 
			$oStmt->execute(); 
			$results = $oStmt->fetchAll(PDO::FETCH_ASSOC);
						
			if (!empty($results)) {
				$i = 0;
				foreach ($results as $record){
					 $this->elements[$i] = [
														"element" => new ElementDefinition($record["elementID"]),
														"next" => $record["nextElementID"]
						];
						
						$i++;
				}
				
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
		
		$this->prerequisites = array();
		
		//TODO: prerequisites ook in database steken OF ook een start trigger service maken OF bij process definiëren welke objecten gekend moeten zijn...
		
		switch ($this->id) {
			case 1:
				$this->prerequisites = [
										"giver" => array(
											"value" => (isset($_SESSION['user'])) ? $_SESSION['user'] : null,
											"type" =>	"Giver"
											),
										"receiver" => array(
											"value" => (isset($_SESSION['wishReceiver'])) ? $_SESSION['wishReceiver'] : null,
											"type" =>	"Receiver"
											)
										];
				break;
			case 2:
				$this->prerequisites = [
										//TODO: voorlopig geen prereq, want registratieprocedures staan nog niet op punt. (eerst zorgen dat een "wish receiver" makkelijk geselecteerd kan worden)
										/* "receiver" => array(
											"value" => (isset($_SESSION['wishReceiver'])) ? $_SESSION['wishReceiver'] : null,
											"type" =>	"Receiver"
											) */
										];
				break;
			case 3:
				$this->prerequisites = array();
			default:
				$this->name = "Unknown";
				break;
		}
		
		return $found;
	}
	
	public function __toString () {
		return "This is process '".$this->name."'";
	}
	
	public function getID () {
		return $this->id;
	}
	
	public function getName () {
		return $this->name;
	}
	
	public function getPrerequisites() {
		return $this->prerequisites;
	}
	
	public function getElements() {
		return $this->elements;
	}
	
	public function getTrigger() {
		
		if (empty($this->trigger)){
			if (!empty($this->elements)){
				foreach ($this->elements as $element){
					if ($element["element"]->getType()=="trigger"){
						$this->trigger = $element["element"];
					}	
				}
			} else {
				$this->trigger = null;
			}
		}			
		
		return $this->trigger;
		
	}
	
	public function determineNextElement($currElement){
		
		$nextElement = null;
		
		if (!empty($this->elements)){
			foreach ($this->elements as $element){
				if ($element["element"]==$currElement && $element["next"] != null){
					$nextElement = new ElementDefinition($element["next"]);
					break;
				}
			}
		}
		
		return $nextElement;
	}
	
	public function show(){
				$next = $this->trigger;
				do {
					echo $next;
					echo "<br/>";
					$next = $this->determineNextElement($next);
				} while (!empty($next)) ;
					
	}
}

?>