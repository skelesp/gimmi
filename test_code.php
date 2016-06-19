<?php 
//
require_once "./lib/POF/ProcessEngine.class.php";
require_once "./lib/POF/Process.class.php";

$process = new Process(2);
$trigger = null;
echo $process;
echo " with elements:<br />";
$process->getTrigger();
$process->show();

?>