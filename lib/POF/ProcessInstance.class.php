<?php
require_once ('./lib/POF/Process.class.php');
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
	
	public function __construct ($processID) {
		$this->id = "1234"; //TODO: haal de id van deze nieuwe instance uit DB (=nieuwe ID ophalen)
		$this->process = new Process($processID);
		$this->status = "created";
		$this->currentElement = "Trigger";
		$this->variables = array(); //at start of process: 	variables are filled with prerequisites 
									//during a process: 	variables can be added
		$this->missingInfo = array();
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
	
	public function getMissingInfo(){
		return $this->missingInfo;
	}
	public function __toString () {
		return "Running process = ".$this->process->getName();
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
				$this->currentElement = "search_a_gift_idea";
				break;
			case 3: 
				$this->currentElement = "authenticate_a_user";
				break;
		}
		
	}
	
	public function setNextElement () {
		//Dit hoort in de Process class: "deze instance heeft activiteit X afgerond"..."wat is de volgende stap in het proces?" ...
		switch($this->process->getID()) {
			case 1:
				$this->currentElement = "end";
				break;
			case 2: 
				switch ($this->currentElement){
					case "search_a_gift_idea":
						$this->currentElement = "reserve_a_wish";
						break;
				}
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