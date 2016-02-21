<?php

/**
 * The person class describes a human being.
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 18-okt-2015 18:35:27
 */
class Person
{

// Properties

	private $firstName;
	private $lastName;
	private $email;
	private $nickname;

// Magic Methods

	function __construct()
	{
	}

	function __destruct()
	{
	}
	
	function __toString(){
		$text = $this->firstName." ".$this->lastName." can be reached on ".$this->email;
		if (!empty($this->nickname)){
			$text = $text."and you can call him/her '".$this->nickname."'";
		}
		$text = $text.".";
		return $text;
	}
	
// Accessors
	
	public function getlastName()
	{
		return $this->lastName;
	}

	/**
	 * 
	 * @param newVal
	 */
	public function setlastName($newVal)
	{
		$this->lastName = $newVal;
	}

	public function getfirstName()
	{
		return $this->firstName;
	}
	/**
	 * 
	 * @param newVal
	 */
	public function setfirstName($newVal)
	{
		$this->firstName = $newVal;
	}

	public function getemail()
	{
		return $this->email;
	}
	/**
	 * 
	 * @param newVal
	 */
	public function setemail($newVal)
	{
		$this->email = $newVal;
	}

// Methods
	public function register () {
		
	}
}
?>