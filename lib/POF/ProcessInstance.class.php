<?php
require_once ('Process.class.php');
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
	protected $variables; // @array Array of variables for this process instance
	
	
	public function __construct ($processID) {
		$this->process = new Process($processID);
		$this->status = "created";
		$this->variables = array();
	}
	
	public function getProcess (){
		return $this->process;
	}
	
	public function __toString () {
		return "This is an instance of ".$this->process->getName();
	}
	
	public function getStatus () {
		return $this->status;
	}
	
	public function checkPrerequisites (){
		// Check de prerequisites
		$ok = true;
		foreach ($this->process->getPrerequisites() as $prereq => $value) {
			if (empty($value)) {
				$this->variables[$prereq] = null;
				$ok = false;
			} else {
				$this->variables[$prereq] = $value;
			}
		}
		return $ok;
	}	
	public function trigger () {
		$this->status = "started";	
	}
	
	public function getNextElement () {
	}
	
	public function end () {
	}	
	
}

?>