<?php

require_once "./lib/GIMMI/Person.class.php";

/**
 * The User class describes a user of the website.
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 18-may-2016 18:35:27
 */
class User extends Person
{
	//Properties
	
	private $login;
	private $pass;
	private $authenticated;
	
	//Constructor
	
	public function __construct($l = null, $p = null){
		$this->login = $l;
		$this->pass = md5($p);		
		$authenticated = false;
	}
	
	//Accessors
	public function getLogin () {
		return $this->login;
	}
	public function isAuthenticated () {
		return $this->authenticated;
	}
	
	public function setPassword(){
	}
	
	//Methods
	
	public function register(){
	}
	
	public function activate(){
	}
	
	public function authenticate() {
		require './db_config.php';
		//TODO: Verwijder database code en plaats het in een DAO object --> Geen DB code in een class
		try 
		{ 
			$sQuery = " 
				SELECT 
					*
				FROM 
					persons
				WHERE
					login LIKE '".$this->login."'
					AND
					pass LIKE '".$this->pass."'"; 
			 
			$oStmt = $db->prepare($sQuery); 
			$oStmt->execute(); 
			 		
			$results = $oStmt->fetch(PDO::FETCH_ASSOC);
			
			if (empty($results)){
				$this->authenticated = false;
				return false;
			} else {
				$this->authenticated = true;
				return true;
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
	
	public function logout () {
		unset( $_SESSION['user'] );
		unset( $_SESSION['wishReceiver'] );
		header("Refresh: 0");
	}
	
	
	public function remove(){
	}
	
}