<?php
require_once ('./lib/POF/Process.class.php');
require_once ('./lib/POF/ProcessInstance.class.php');
require_once ('./lib/GIMMI/Person.class.php');
/**
 * The ProcessEngine class is responsible for running through processes
 
 * @author Stijn Beeckmans
 * @version 0.1
 * @created 15-mar-2016 23:37:24
 */
class ProcessEngine
{
	protected $processInstance;
	private $status;
	
	public function __construct ($object) {
		$this->processInstance = $object;
		$this->status = "running";
	}
	
	public function getInstance() {
		return $this->processInstance;
	}
	
	public function determineNextAction (){
		switch ($this->processInstance->getStatus()) {
			case 'created' : 
				$this->launchProcessInstance();
				break;
			case 'running' : 
				$this->executeElement();
				break;
			case 'ended' : 
				$this->closeProcessInstance();
				break;
		}
	}
	
	private function launchProcessInstance(){
		// Check if prerequisites are available
		$count = 0;
		if (!$this->processInstance->checkPrerequisites()) { //not all prereqs available
			
			foreach ($this->processInstance->getMissingInfo() as $prereq => $type) {
				// Get a value for each prerequisite
				// TODO: Dit moet dynamischer, nu kan enkel een persoonsregistratie opgestart worden.
				// (Hieronder standaard registratie formulier voor een persoon)
				// TODO: eerste test: maak onderscheid tussen 
				//								Giver(=user (Person)) --> info via authenticate proces "authenticate a user"
				//								Receiver (Person)	  --> Activiteit maken om Receiver te selecteren/registreren "register a wish receiver"
				
				switch($type) { //TODO: Verwijder deze switch als er ook wensen voor anderen aangemaakt kunnen worden.
					case 'Receiver':
						$_SESSION['wishReceiver'] = $_SESSION['user'];
						header("Refresh: 0");
						exit();
						break;
					case 'Giver':
					case 'User':
						// Go to other proces to login
						//TODO: opslaan in db dat er een andere instance wacht op het eindigen van dit proces
						header("location: ?pid=3");
						break;
				}
			}
			
		} else {
			// Trigger the process instance
			$this->processInstance->trigger();
			$this->determineNextAction ();
		}
	}
	
	private function executeElement(){
		//$_SESSION['content'] = "Execute ".$this->processInstance->getCurrentElement();
		$type = "act";
		$activityFinished = false;
		include "./processes/activities/".$type."_".$this->processInstance->getCurrentElement().".php";
		if ( $activityFinished ) {
			$this->getNextElement();
		}
	}
	
	private function getNextElement(){
		header("Location: ./index.php");
		$_SESSION['DEBUG_message'] = "Next element is: XXXX";
	}
	
	private function closeProcessInstance() {
	}
}