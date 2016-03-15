<?php
require_once ('Person.php');
/**
 * This class describes a wish that someone has. The purpose of this wish is to
 * make clear to others what a person would like to receive.
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 18-okt-2015 18:51:14
 */
class Wish
{

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
	
// MAGIC METHODS
	function __construct($name = "NewWish"){
		$this->name = $name;
		$this->creator = new Person();
		$this->owner = new Person();
	}

	function __destruct(){
	}
	
// ACCESSORS
	
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

// METHODS

	/**
	 * Save a wish.
	 */
	public function save(){
		/* 	Save the wish object.
			This can be a create or an update.
		*/
	}

	/**
	 * Reserve a wish so no one else will buy the same.
	 */
	public function reserve(){
		/* Change the status of the Wish object */
	}
}
?>