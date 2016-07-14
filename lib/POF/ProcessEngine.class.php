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
			//TODO: Verwijder deze lijnen : niet nodig. Gewoon het proces triggeren??
			$this->processInstance->trigger();
			$this->processInstance->setNextElement();
			$this->executeElement ();
		}
	}
	
	public function executeElement(){
		if ($this->processInstance->getStatus() != "ended"){
			println("1");			
			$element = $this->processInstance->getCurrentElement();
			println($element->getType());
			switch($element->getType()){
				case 'trigger':
					println("2a");
					$this->launchProcessInstance();
					break;
					
				case 'activity':
					println("2b");
					$activityFinished = false;
					$script = $element->getService();
					if (! empty($script)) {
					
						include "./processes/activities/".$this->processInstance->getCurrentElement()->getService();

					} else {
						$activityFinished = true;
					}
					if ( $activityFinished ) {
						$this->getNextElement();
					}
					
					break;
				
				case 'end state':
					$this->closeProcessInstance();
					
					break;
					
				default:
					println("ERROR: unknown element type");
					
					break;
			}
		} else {
			println("processInstance has ended");
		}
				
	}
	
	public function getNextElement(){
		$this->processInstance->setNextElement();
		
		if ($this->processInstance->getCurrentElement()->getType() != "end state") {
			$this->executeElement();
		} else {
			$this->closeProcessInstance();
			echo "END!!!";
		}
		
	}
	
	private function closeProcessInstance() {
		$this->processInstance->end();
		$_SESSION['DEBUG_message'] = "Process ended";
		//header("location: localhost/gimmi/");
		
	}
}