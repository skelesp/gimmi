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
	
	public function __construct ($object) {
		$this->processInstance = $object;
	}
	
	public function determineNextAction (){
		switch ($this->processInstance->getStatus()) {
			case 'created' : $this->launchProcessInstance();
			case 'running' : $this->executeElement();
			case 'ended' : $this->closeProcessInstance();
		}
	}
	
	private function launchProcessInstance(){
		// Check if prerequisites are available
		if (!$this->processInstance->checkPrerequisites()) {
			foreach ($this->processInstance->getMissingInfo() as $prereq => $type) {
				switch ($type){
					case 'Giver':
					case 'Receiver':
					
						$Person = new Person ($type);
						$_SESSION['content'] = $Person->register();						
						break;
				}
			}
		}
		$this->processInstance->trigger();
	}
	private function executeElement(){
		$_SESSION['content'] = "Execute ".$this->processInstance->getCurrentElement();
		include "./processes/activities/act_".$this->processInstance->getCurrentElement().".php";
	}
	
	private function closeProcessInstance() {
	}
}