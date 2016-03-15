<?php

/**
 * The process class describes a process.
 
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 22-nov-2015 23:37:24
 */
class Process
{	
	protected $id;
	protected $name;
		
	public function __construct ($processID) {
		$this->id = $processID;
		switch ($processID) {
			case 1:
				$this->name = "Add a wish";
				break;
			case 2:
				$this->name = "Search a wish";
				break;
			case 3:
				$this->name = "Buy a gift";
				break;
			case 4:
				$this->name = "Give a gift";
				break;
			default:
				$this->name = "Unknown";
				break;
		}
	}
	
	public function __toString () {
		
	}
	
	public function getName () {
		return $this->name;
	}
}

?>