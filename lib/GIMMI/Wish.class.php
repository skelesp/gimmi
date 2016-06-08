<?php
require_once ('./lib/GIMMI/Person.class.php');
/**
 * This class describes a wish that someone has. The purpose of this wish is to
 * make clear to others what a person would like to receive.
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 18-okt-2015 18:51:14
 */
class Wish
{

	private $id;
	/**
	 * The name of a wish.
	 */
	private $name;
	private $description;
	/**
	 * A URL on which there's more info about the wish.
	 */
	private $url;
	/**
	 * The estimated price of a wish.
	 */
	private $price;
	private $image;
	/**
	 * The status of a wish. The options are
	 * <ul>
	 * 	<li>open</li>
	 * 	<li>reserved</li>
	 * 	<li>bought</li>
	 * 	<li>received</li>
	 * </ul>
	 */
	private $status;
	/**
	 * The amount of times the wish can be fulfilled.
	 */
	private $amount;
	private $creator;
	/**
	 * The date on which the wish must ultimately be fulfilled.
	 */
	private $deadline;
	/**
	 * The person who wants to receive the wish.
	 */
	private $owner;
	private $private;
	
// MAGIC METHODS
	function __construct($id = null){
		if (isset($id)) {
			//TODO: Verwijder database code en plaats het in een DAO object --> Geen DB code in een class
		
			require './db_config.php';
			
			try 
			{ 
				$sQuery = " 
					SELECT 
						*
					FROM 
						wishes
					WHERE
						wishID = '".$id."'"; 
				
				$oStmt = $db->prepare($sQuery); 
				$oStmt->execute(); 
						
				$results = $oStmt->fetch(PDO::FETCH_ASSOC);
				
				if (!empty($results)) {
					
					$this->id = $results["wishID"];
					$this->name = $results["name"];
					$this->description = $results["description"];
					$this->price = $results["price"];
					$this->amount = $results["amount"];
					
					return true;
				} else {
					//TODO: throw an error
					return false;
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
		} else {
			$this->name = "";
			//$this->creator = new Person('Giver');
			//$this->owner = new Person('Receiver');
			$this->status = "open";
		}
	}
	
	function __toString(){
		return $this->name." wordt geschat op ".$this->price." euro (private = ".(($this->private) ? "private" : "public").")<br />Korte beschrijving: ".$this->description;
	}
	
	function __destruct(){
	}
	
// ACCESSORS
	
	public function getID(){
		return $this->id;
	}
	
	/**
	 * The amount of times the wish can be fulfilled.
	 */
	public function getAmount(){
		return $this->amount;
	}

	/**
	 * The amount of times the wish can be fulfilled.
	 * 
	 * @param newVal
	 */
	public function setAmount($newVal){
		$this->amount = $newVal;
	}

	public function getStatus(){
		return $this->status;
	}

	/**
	 * 
	 * @param newVal
	 */
	public function setStatus($newVal){
		$this->status = $newVal;
	}

	public function getImage(){
		return $this->image;
	}

	/**
	 * 
	 * @param newVal
	 */
	public function setImage($newVal){
		$this->image = $newVal;
	}

	public function getPrice(){
		return $this->price;
	}

	/**
	 * 
	 * @param newVal
	 */
	public function setPrice($newVal){
		$this->price = $newVal;
	}

	public function getURL(){
		return $this->url;
	}

	/**
	 * 
	 * @param newVal
	 */
	public function setURL($newVal){
		$this->url = $newVal;
	}

	public function getDescription(){
		return $this->description;
	}

	/**
	 * 
	 * @param newVal
	 */
	public function setDescription($newVal){
		$this->description = $newVal;
	}

	public function getName(){
		return $this->name;
	}

	/**
	 * 
	 * @param newVal
	 */
	public function setName($newVal){
		$this->name = $newVal;
	}

	public function getCreator(){
		return $this->creator;
	}

	/**
	 * 
	 * @param newVal
	 */
	public function setCreator($newVal){
		$this->creator = $newVal;
	}

	public function getDeadline(){
		return $this->deadline;
	}

	/**
	 * 
	 * @param newVal
	 */
	public function setDeadline($newVal){
		$this->deadline = $newVal;
	}
	
	/**
	 * 
	 * @param newVal
	 */
	public function setOwner($newVal){
		$this->owner = $newVal;
	}
	
	public function getOwner(){
		return $this->owner;
	}
	
	public function setPrivate($newVal){
		$this->private = $newVal;
	}
	
	public function isPrivate($newVal){
		return $this->private;
	}

// METHODS

	/**
	 * Save a wish.
	 */
	public function register(){
		
		/* 	Save the wish object.
			This can be a create or an update.
		*/
		
		//TODO: Verwijder database code en plaats het in een DAO object --> Geen DB code in een class
		
		require './db_config.php';
		
		try 
		{ 
			// TODO: voeg personID toe van de creator / owner toe (via objecten in dit object)
			$sQuery = " 
				INSERT INTO wishes (name,description,price,ownerID, creatorID) 
				VALUES ('".$this->name."','".$this->description."',".$this->price.",".$this->owner->getID().",".$this->creator->getID().")";
			// echo $sQuery;
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
	}

	/**
	 * Reserve a wish so no one else will buy the same.
	 */
	public function reserve(){
		/* Change the status of the Wish object */
	}
}
?>