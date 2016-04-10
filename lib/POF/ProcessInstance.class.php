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
	
	public function __construct ($processID) {
		$this->process = new Process($processID);
		$this->status = "created";
		$this->variables = array(); //at start of process: 	variables are filled with prerequisites 
									//during a process: 	variables can be added
		$this->missingInfo = array();
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
		return "This is an instance of ".$this->process->getName();
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
		$this->currentElement = "Make_a_wish"; //TODO: verwijder deze lijn! Moet automatisch gedetecteerd worden.
	}
	
	public function setNextElement () {
		
	}
	
	public function end () {
	}	
	
}

?>