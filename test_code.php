<?php 
//
require_once "./lib/POF/ProcessEngine.class.php";
require_once "./lib/POF/Process.class.php";

$process = new Process(2);
$trigger = null;
echo $process;
echo "<br/>with elements:<br />";

$process->getTrigger();

echo "<br/>";
print_r($process->getElements());

?>