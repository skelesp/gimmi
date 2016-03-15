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
	protected $id;
	protected $process;
	protected $status;
	
	
	public function __construct ($processID) {
		$this->process = new Process($processID);
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
	
	public function start () {
		//check preconditions of process
		//go to next element
	}
	
	public function end () {
	}	
	
}

?>