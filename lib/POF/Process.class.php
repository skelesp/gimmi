<?php

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
	protected $prerequisites; //@var array of prerequisites to be able to start the process
	protected $elements; //@var array of elements of the process
	
	public function __construct ($processID) {
		$this->id = $processID;
		$this->prerequisites = array();
		$this->elements = array();
		//TODO: Change switch to database query to link processID with a process name
		switch ($this->id) {
			case 1:
				$this->name = "Add a wish";
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
				$this->name = "Search a wish";
				$this->prerequisites = [
										//TODO: voorlopig geen prereq, want registratieprocedures staan nog niet op punt. (eerst zorgen dat een "wish receiver" makkelijk geselecteerd kan worden)
										/* "receiver" => array(
											"value" => (isset($_SESSION['wishReceiver'])) ? $_SESSION['wishReceiver'] : null,
											"type" =>	"Receiver"
											) */
										];
				break;
			case 3:
				$this->name = "Login";
				$this->prerequisites = array();
			default:
				$this->name = "Unknown";
				break;
		}
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
}

?>