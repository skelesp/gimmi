<?php
require_once ('./lib/POF/Process.class.php');
require_once ('./lib/POF/ElementDefinition.class.php');
/**
 * The processInstance class describes a process instance.
 
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 15-mar-2016 23:37:24
 */
class ProcessInstance 
{	
	protected $id; // @var Process Instance ID
	protected $process; // @var Process class object
	protected $status; // @var Status of the process instance
	protected $currentElement; // @var Current element in which the process instance is active now
	protected $variables; // @var Array of variables for this process instance
	protected $missingInfo; //@var Array of missing info (= not available in variables
	protected $callingProcess; //@var holds the reference to the calling process
	
	public function __construct ($process, $instanceID = null) {
		$this->process = $process;
		
		if (empty($instanceID)) {
			println("nieuwe instance");
			
			$this->status = "created";
			$this->currentElement = $process->getTrigger();

				//TODO: Verwijder database code en plaats het in een DAO object --> Geen DB code in een class
					
				require './db_config.php';
				
				try 
				{ 
					// TODO: voeg personID toe van de creator / owner toe (via objecten in dit object)
					$sQuery = " 
						INSERT INTO process_instances (processID, currentElementID,currentActorID) 
						VALUES (".$this->process->getID().",".$this->currentElement->getID().", 1)";
					echo $sQuery;
					$oStmt = $db->prepare($sQuery); 
					$oStmt->execute(); 
					 		
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
			$this->id = $db->lastInsertId();
			$this->variables = array(); //at start of process: 	variables are filled with prerequisites 
										//during a process: 	variables can be added
			$this->missingInfo = array();

		} else {
			println("bestaande instance");
			//SELECT * FROM process_instances WHERE instanceID = $instanceID
			
					//TODO: Verwijder database code en plaats het in een DAO object --> Geen DB code in een class
		
					require './db_config.php';
					
					try 
					{ 
						$sQuery = " 
							SELECT 
								*
							FROM 
								process_instances
							WHERE
								instanceID =".$instanceID; 
						$oStmt = $db->prepare($sQuery); 
						$oStmt->execute(); 
								
						$results = $oStmt->fetch(PDO::FETCH_ASSOC);
						
						if (!empty($results)) {
							
							$this->id 			= $instanceID;
							$this->process 		= new Process($results["processID"]);
							println("curr el: ".$results["currentElementID"]);
							$this->currentElement 	= new ElementDefinition($results["currentElementID"]);
							//$this->owner 		= $results["currentActorID"];
							$this->status = "running";
							$this->variables = array(); //at start of process: 	variables are filled with prerequisites 
										//during a process: 	variables can be added
							
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
		}
	}

	public function __toString () {
		return "Running process = ".$this->process->getName()."(".$this->id."-".$this->status.")";
	}
	
	public function getID (){
		return $this->id;
	}
	
	public function getProcess (){
		return $this->process;
	}
	
	public function getCurrentElement () {
		return $this->currentElement;
	}
	
	public function setNextElement () {
		//TODO: Dit hoort in de Process class: "deze instance heeft activiteit X afgerond"..."wat is de volgende stap in het proces?" ...
		
		//TODO: switch verwijderen en code uit case 2 gebruiken (voorwaarde: alle processen zitten in de DB!)
		switch($this->process->getID()) {
			case 1:
				$this->currentElement = "end";
				break;
			case 2: 
				$this->currentElement = $this->process->determineNextElement($this->currentElement);
				//TODO: Verwijder database code en plaats het in een DAO object --> Geen DB code in een class
					
				require './db_config.php';
				
				try 
				{ 
					// TODO: voeg personID toe van de creator / owner toe (via objecten in dit object)
					$sQuery = " 
						UPDATE process_instances 
						SET currentElementID = ".$this->currentElement->getID()."
						WHERE instanceID = ".$this->id;
					echo $sQuery;
					$oStmt = $db->prepare($sQuery); 
					$oStmt->execute(); 
					 		
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
				break;
			case 3: 
				$this->currentElement = "authenticate_a_user";
				break;
		}
	}
	
	public function getMissingInfo(){
		return $this->missingInfo;
	}
	public function getStatus () {
		return $this->status;
	}
	
	public function setStatus ($val) {
		$this->status = $val;
	}
	
	public function checkPrerequisites (){
		// Check de prerequisites
		$ok = true;
		
		foreach ($this->process->getPrerequisites() as $prereq => $info) {
			if (empty($info["value"])) {
				
				$this->variables[$prereq] = null;
				$this->missingInfo[$prereq] = $info["type"];
				$ok = false;
				
			} else {
				
				$this->variables[$prereq] = $info["value"];
				
			}
		}
		return $ok;
	}
	
	public function trigger () {
		$this->status = "running";
		//TODO: verwijder deze switch! Moet automatisch gedetecteerd worden.
		switch($this->process->getID()) {
			case 1:
				$this->currentElement = "Make_a_wish"; 
				break;
			case 2: 
				$this->currentElement = $this->process->getTrigger();
				break;
			case 3: 
				$this->currentElement = "authenticate_a_user";
				break;
		}
		
	}
	
	public function end () {
		
	}	
	
}

?>