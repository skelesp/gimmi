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
	
	public function getInstance() {
		return $this->processInstance;
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
				//								Giver(=user (Person)) --> info via authenticate proces
				//								Receiver (Person)	  --> Activiteit maken om Receiver te selecteren/registreren
				// TODO: haal Receiver voorlopig uit de activity flow --> enkel wish toevoegen voor jezelf!!
						
				$Person = new Person ($type);
				$result = $Person->register();
				
				
				// Finalize the loop
				if ($result == 1) { // a prereq is filled
					$_POST = array();
					//reload to get other prereqs
					header("Refresh: 0");
					exit();
				} else {
					$_SESSION['content'] = $result;
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
		include "./processes/activities/act_".$this->processInstance->getCurrentElement().".php";
	}
	
	private function closeProcessInstance() {
	}
}